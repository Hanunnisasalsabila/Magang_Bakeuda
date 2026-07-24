import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';

class DetailReviewSpopScreen extends StatefulWidget {
  final String idTransaksi;
  final bool isReadOnly;

  const DetailReviewSpopScreen({
    super.key,
    required this.idTransaksi,
    this.isReadOnly = false,
  });

  @override
  State<DetailReviewSpopScreen> createState() => _DetailReviewSpopScreenState();
}

class _DetailReviewSpopScreenState extends State<DetailReviewSpopScreen> {
  final _spopService = TransaksiSpopService(ApiService());

  Map<String, dynamic>? _transaksi;
  bool _isLoading = true;
  bool _isProcessing = false;
  String? _errorMsg;
  bool _isSatellite = true;
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });
    try {
      final data = await _spopService.getDetailTransaksi(widget.idTransaksi);

      // Mapping untuk transaksi HAPUS
      if ((data['jenis_transaksi'] == 'HAPUS' ||
              data['jenis_transaksi'] == 'MUTASI') &&
          data['detail_asal'] != null &&
          (data['detail_asal'] as List).isNotEmpty) {
        data['detail_tujuan'] = (data['detail_asal'] as List)
            .map(
              (asal) => {
                'id_objek_pajak': asal['id_objek_pajak'],
                'nik_calon_subjek': asal['nik_subjek_pajak'],
                'calon_subjek_json': {
                  'nama': asal['subjek_pajak']?['nama_wp'],
                  'alamat': asal['subjek_pajak']?['alamat_wp'],
                },
              },
            )
            .toList();

        data['objek_pajak_sementara'] = (data['detail_asal'] as List)
            .map(
              (asal) => {
                'id_objek_pajak': asal['id_objek_pajak'],
                'jalan_op': asal['objek_pajak']?['jalan_op'],
                'luas_bumi': asal['objek_pajak']?['luas_bumi'],
                'kelas_bumi': asal['objek_pajak']?['kelas_bumi'],
              },
            )
            .toList();
      }

      // Coba lock transaksi jika statusnya MENUNGGU
      if (!widget.isReadOnly && data['status_ajuan'] == 'MENUNGGU') {
        try {
          await _spopService.lockSpop(widget.idTransaksi);
          data['status_ajuan'] = 'PROSES';
        } catch (e) {
          // Gagal lock (misal: dikunci admin lain)
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Gagal mengunci transaksi atau sudah dikunci admin lain.',
                ),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
      }

      setState(() {
        _transaksi = data;
      });
    } on DioException catch (e) {
      setState(() {
        _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat detail';
      });
    } catch (e) {
      setState(() {
        _errorMsg = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  final _catatanController = TextEditingController();
  String _kodeBlok = '';
  String _kodeJenisOp = '0'; // 0 - Bumi, 1 - Bangunan

  @override
  void dispose() {
    _catatanController.dispose();
    if (!widget.isReadOnly &&
        _transaksi != null &&
        _transaksi!['status_ajuan'] == 'PROSES') {
      _spopService.unlockSpop(widget.idTransaksi).catchError((_) {});
    }
    super.dispose();
  }

  Future<void> _prosesApprove() async {
    final needsNOP =
        _transaksi?['jenis_transaksi'] == 'BARU' ||
        _transaksi?['jenis_transaksi'] == 'PECAH' ||
        _transaksi?['jenis_transaksi'] == 'GABUNG';

    if (needsNOP) {
      if (_kodeBlok.isEmpty || _kodeBlok.length != 3) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Kode Blok harus 3 digit!'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
    }

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Konfirmasi Persetujuan'),
        content: const Text(
          'Anda yakin menyetujui pengajuan ini? Keputusan ini final.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Ya, Setujui'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    setState(() => _isProcessing = true);
    try {
      if (_transaksi?['status_ajuan'] == 'MENUNGGU') {
        try {
          await _spopService.lockSpop(widget.idTransaksi);
          _transaksi?['status_ajuan'] = 'PROSES';
        } catch (_) {}
      }
      if (needsNOP) {
        final tujuan = _transaksi?['detail_tujuan']?[0] ?? {};
        final kec = tujuan['kecamatan_op_baru'];
        final desa = tujuan['kelurahan_op_baru'];
        // Asumsi kita oper kode blok dan kode jenis OP, sementara kode_wilayah dilewatkan karena diurus backend.
        await _spopService.approveSpop(
          widget.idTransaksi,
          kodeBlok: _kodeBlok,
          kodeJenisOp: _kodeJenisOp,
        );
      } else {
        await _spopService.approveSpop(widget.idTransaksi);
      }
      if (mounted) Navigator.pop(context, 'DISETUJUI');
    } on DioException catch (e) {
      if (mounted) {
        final msg = e.response?.data?['message'];
        final errText = msg is List
            ? msg.join(', ')
            : (msg?.toString() ?? 'Gagal memproses verifikasi');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errText), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _prosesRevisi() async {
    if (_catatanController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Catatan revisi harus diisi!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    setState(() => _isProcessing = true);
    try {
      if (_transaksi?['status_ajuan'] == 'MENUNGGU') {
        try {
          await _spopService.lockSpop(widget.idTransaksi);
          _transaksi?['status_ajuan'] = 'PROSES';
        } catch (_) {}
      }
      await _spopService.revisiSpop(
        widget.idTransaksi,
        _catatanController.text.trim(),
      );
      if (mounted) Navigator.pop(context, 'REVISI');
    } on DioException catch (e) {
      if (mounted) {
        final msg = e.response?.data?['message'];
        final errText = msg is List
            ? msg.join(', ')
            : (msg?.toString() ?? 'Gagal');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errText), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _prosesTolak() async {
    if (_catatanController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Catatan penolakan harus diisi!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    setState(() => _isProcessing = true);
    try {
      if (_transaksi?['status_ajuan'] == 'MENUNGGU') {
        try {
          await _spopService.lockSpop(widget.idTransaksi);
          _transaksi?['status_ajuan'] = 'PROSES';
        } catch (_) {}
      }
      await _spopService.tolakSpop(
        widget.idTransaksi,
        _catatanController.text.trim(),
      );
      if (mounted) Navigator.pop(context, 'DITOLAK');
    } on DioException catch (e) {
      if (mounted) {
        final msg = e.response?.data?['message'];
        final errText = msg is List
            ? msg.join(', ')
            : (msg?.toString() ?? 'Gagal');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errText), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Widget _buildBlueHeader(String title) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: const BoxDecoration(
        color: Color(0xFF0C2A5B), // Navy blue
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildSectionCard({required String title, required List<Widget> children}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      elevation: 0,
      color: Colors.white,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBlueHeader(title),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: children,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubHeader(String title, [String? rightText]) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.blue.shade900,
            ),
          ),
          if (rightText != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.blue.shade100,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                rightText,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue.shade700,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDataRow(String label, String value) {
    return _buildSingleColumn(label, value);
  }

  Widget _buildGridRow(List<Map<String, String>> items) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.map((item) {
          return Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['label']!,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item['value']!,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSingleColumn(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  String _fmt(dynamic v) => v?.toString() ?? '-';
  String _fmtNop(String? rawNop) {
    if (rawNop == null || rawNop.isEmpty) return '-';
    if (rawNop.length != 18) return rawNop;
    return '${rawNop.substring(0, 2)}.${rawNop.substring(2, 4)}.${rawNop.substring(4, 7)}.${rawNop.substring(7, 10)}.${rawNop.substring(10, 13)}.${rawNop.substring(13, 17)}.${rawNop.substring(17, 18)}';
  }

  String _fmtDate(String? iso) {
    if (iso == null || iso.isEmpty) return '-';
    try {
      final date = DateTime.parse(iso).toLocal();
      return DateFormat('dd MMM yyyy, HH:mm', 'id').format(date);
    } catch (_) {
      return iso;
    }
  }

  String _labelJenis(String? j) {
    const m = {
      'BARU': 'Pendaftaran Baru',
      'MUTASI': 'Mutasi',
      'PERUBAHAN_DATA': 'Perubahan Data',
      'HAPUS': 'Penghapusan',
    };
    return m[j] ?? j ?? '-';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tx = _transaksi;
    final bool canVerify =
        tx != null &&
        (tx['status_ajuan'] == 'MENUNGGU' ||
            tx['status_ajuan'] == 'SEDANG_DITINJAU' ||
            tx['status_ajuan'] == 'PROSES');

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Pemeriksaan Berkas'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadDetail),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMsg != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 48,
                    color: theme.colorScheme.error,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _errorMsg!,
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _loadDetail,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Coba Lagi'),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Image.asset(
                          'assets/logo-purbalingga.png',
                          width: 50,
                          height: 50,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.account_balance,
                            size: 50,
                            color: Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'BADAN KEUANGAN DAERAH (BAKEUDA)',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black54,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Verifikasi Berkas SPOP PBB-P2',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Formulir SPOP-A01-2024 • ID: #${widget.idTransaksi.split('-').first.toUpperCase()}',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.black54,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 8.0,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'JENIS AJUAN',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.black54,
                              ),
                            ),
                            Text(
                              _labelJenis(tx?['jenis_transaksi']),
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'TGL PENGAJUAN',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.black54,
                              ),
                            ),
                            Text(
                              _fmtDate(
                                tx?['tanggal_pengajuan'] ?? tx?['created_at'],
                              ),
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Divider(thickness: 2),

                  _buildSectionCard(
                    title: 'A. NOMOR OBJEK PAJAK (NOP)',
                    children: [
                      _buildSingleColumn(
                        'Nomor Objek Pajak',
                        tx?['nop_bersama'] != null
                            ? tx!['nop_bersama']
                            : (([
                                    'BARU',
                                    'PECAH',
                                    'GABUNG',
                                  ].contains(tx?['jenis_transaksi']))
                                  ? (tx?['status_ajuan'] == 'DISETUJUI' &&
                                            tx?['detail_tujuan'] != null &&
                                            (tx!['detail_tujuan'] as List)
                                                .isNotEmpty &&
                                            tx!['detail_tujuan'][0]['nop_generated'] !=
                                                null
                                        ? _fmtNop(
                                            tx!['detail_tujuan'][0]['nop_generated'],
                                          )
                                        : 'Akan digenerate oleh Bakeuda')
                                  : _fmt(
                                      tx?['detail_asal']?.isNotEmpty == true
                                          ? tx!['detail_asal'][0]['nop_asal']
                                          : null,
                                    )),
                      ),
                      _buildSingleColumn(
                        'Format NOP',
                        'Prov-Kab-Kec-Kel-Blok-No.Urut-Kode',
                      ),
                    ],
                  ),

                  _buildSectionCard(
                    title: 'B. DATA PENGAJUAN / SUBJEK PAJAK',
                    children: [
                      if (tx?['detail_tujuan'] != null &&
                          (tx!['detail_tujuan'] as List).isNotEmpty)
                        Builder(
                          builder: (context) {
                            final subjek = tx!['detail_tujuan'][0]['calon_subjek_json'] ?? {};
                            final tujuan = tx['detail_tujuan'][0];
                            final nama = subjek['nama_subjek'] ??
                                tx['nama_pengaju'] ??
                                tx['pengaju']?['nama_lengkap'] ??
                                '-';
                            final nik = subjek['nik'] ??
                                subjek['npwp'] ??
                                tujuan['nik_calon_subjek'] ??
                                '-';
                            final alamat = subjek['alamat_jalan'] ?? subjek['alamat'] ?? '-';
                            final rt = subjek['rt'] ?? '-';
                            final rw = subjek['rw'] ?? '-';
                            final kel = subjek['kelurahan'] ?? '-';
                            final kec = subjek['kecamatan'] ?? '-';
                            final kab = subjek['kabupaten'] ?? 'Purbalingga';

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildGridRow([
                                  {'label': 'Nama Subjek', 'value': _fmt(nama)},
                                  {
                                    'label': 'Status Subjek',
                                    'value': _fmt(subjek['status_wp'] ?? subjek['status_subjek'])
                                  },
                                ]),
                                _buildGridRow([
                                  {'label': 'NIK / NPWP', 'value': _fmt(nik)},
                                  {'label': 'Pekerjaan', 'value': _fmt(subjek['pekerjaan'])},
                                ]),
                                if (subjek['no_hp'] != null && subjek['no_hp'].toString().trim().isNotEmpty)
                                  _buildSingleColumn('No. Telepon/HP', _fmt(subjek['no_hp'])),
                                _buildSingleColumn(
                                  'Alamat WP',
                                  '$alamat, RT $rt/RW $rw, KEL. $kel, KEC. $kec\nKAB. $kab',
                                ),
                              ],
                            );
                          },
                        ),
                      _buildGridRow([
                        {'label': 'No. SPPT Lama', 'value': _fmt(tx?['no_sppt_lama'])},
                        {'label': 'Tahun Pajak', 'value': _fmt(tx?['tahun_pajak'])},
                      ]),
                    ],
                  ),
                  _buildSectionCard(
                    title: 'C. DATA OBJEK PAJAK (TANAH)',
                    children: [
                      if (tx?['detail_tujuan'] != null &&
                          (tx!['detail_tujuan'] as List).isNotEmpty)
                        Builder(
                          builder: (context) {
                            final tujuan = tx!['detail_tujuan'][0];
                            final jalan = tujuan['jalan_op_baru'] ?? '-';
                            final blok = tujuan['blok_kav_no_baru'] != null
                                ? '(Blok/Kav: ${tujuan['blok_kav_no_baru']})'
                                : '';
                            final rt = tujuan['rt_op_baru'] ?? '-';
                            final rw = tujuan['rw_op_baru'] ?? '-';
                            final kel = tujuan['kelurahan_op_baru'] ?? '-';
                            final kec = tujuan['kecamatan_op_baru'] ?? '-';

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildGridRow([
                                  {'label': 'Luas Tanah', 'value': '${_fmt(tujuan['luas_tanah_baru'] ?? 0)} m²'},
                                  {'label': 'Jenis Tanah', 'value': _fmt(tujuan['jenis_tanah_baru'])},
                                ]),
                                _buildSingleColumn(
                                  'Letak Objek',
                                  '$jalan $blok\nRT $rt/RW $rw, DESA $kel, KEC. $kec',
                                ),
                              ],
                            );
                          },
                        ),
                    ],
                  ),

                  _buildSectionCard(
                    title: 'D. LOKASI OBJEK / PETA BIDANG',
                    children: [
                      Builder(
                        builder: (context) {
                          final tujuan =
                              (tx?['detail_tujuan'] != null &&
                                  (tx!['detail_tujuan'] as List).isNotEmpty)
                              ? tx!['detail_tujuan'][0]
                              : null;
                          final polyVal = tujuan?['koordinat_polygon'];
                          List polyRaw = [];
                          if (polyVal is String) {
                            try {
                              polyRaw = jsonDecode(polyVal);
                            } catch (e) {}
                          } else if (polyVal is List) {
                            polyRaw = polyVal;
                          }

                          if (polyRaw.isEmpty) {
                            return Padding(
                              padding: const EdgeInsets.all(16),
                              child: Text(
                                'Data titik koordinat tidak tersedia.',
                                style: TextStyle(
                                  color: Colors.grey.shade600,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            );
                          }

                          final points = polyRaw
                              .map(
                                (e) => LatLng(
                                  double.parse(e['lat'].toString()),
                                  double.parse(e['lng'].toString()),
                                ),
                              )
                              .toList();
                          if (points.isEmpty) {
                            return Padding(
                              padding: const EdgeInsets.all(16),
                              child: Text(
                                'Data titik koordinat tidak valid.',
                                style: TextStyle(
                                  color: Colors.grey.shade600,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            );
                          }

                          double sumLat = 0, sumLng = 0;
                          for (var p in points) {
                            sumLat += p.latitude;
                            sumLng += p.longitude;
                          }
                          final center = LatLng(
                            sumLat / points.length,
                            sumLng / points.length,
                          );

                          return Padding(
                            padding: const EdgeInsets.all(16),
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey.shade300),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade50,
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                    ),
                                    child: Wrap(
                                      spacing: 8,
                                      runSpacing: 8,
                                      children: points.asMap().entries.map((e) {
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.blue.shade50,
                                            border: Border.all(color: Colors.blue.shade200),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            'P${e.key + 1}: ${e.value.latitude.toStringAsFixed(6)}, ${e.value.longitude.toStringAsFixed(6)}',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.blue.shade900,
                                            ),
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                  ),
                                  SizedBox(
                                    height: 250,
                                    child: ClipRRect(
                                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(12)),
                                      child: Stack(
                                        children: [
                                          FlutterMap(
                                            mapController: _mapController,
                                            options: MapOptions(
                                              initialCenter: center,
                                              initialZoom: 16.0,
                                              maxZoom: 22.0,
                                              interactionOptions: const InteractionOptions(
                                                flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
                                              ),
                                            ),
                                            children: [
                                              TileLayer(
                                                urlTemplate: _isSatellite
                                                    ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                                    : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                                                userAgentPackageName: 'com.example.magang_bakeuda',
                                                maxZoom: 22,
                                              ),
                                              PolygonLayer(
                                                polygons: [
                                                  Polygon(
                                                    points: points,
                                                    color: Colors.blue.withValues(alpha: 0.3),
                                                    borderColor: Colors.blue,
                                                    borderStrokeWidth: 2,
                                                  ),
                                                ],
                                              ),
                                              MarkerLayer(
                                                markers: points
                                                    .map(
                                                      (p) => Marker(
                                                        point: p,
                                                        width: 40,
                                                        height: 40,
                                                        child: const Icon(Icons.location_on, color: Colors.red, size: 40),
                                                      ),
                                                    )
                                                    .toList(),
                                              ),
                                            ],
                                          ),
                                          Positioned(
                                            top: 10,
                                            right: 10,
                                            child: FloatingActionButton.small(
                                              onPressed: () => setState(() => _isSatellite = !_isSatellite),
                                              backgroundColor: Colors.white,
                                              child: Icon(
                                                _isSatellite ? Icons.map_outlined : Icons.satellite_alt_outlined,
                                                color: Colors.blue,
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            bottom: 10,
                                            right: 10,
                                            child: Column(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                FloatingActionButton.small(
                                                  heroTag: 'zoom_in',
                                                  onPressed: () {
                                                    final zoom = _mapController.camera.zoom;
                                                    if (zoom < 22.0) _mapController.move(_mapController.camera.center, zoom + 1);
                                                  },
                                                  backgroundColor: Colors.white,
                                                  child: const Icon(Icons.add, color: Colors.black87),
                                                ),
                                                const SizedBox(height: 4),
                                                FloatingActionButton.small(
                                                  heroTag: 'zoom_out',
                                                  onPressed: () {
                                                    final zoom = _mapController.camera.zoom;
                                                    if (zoom > 1.0) _mapController.move(_mapController.camera.center, zoom - 1);
                                                  },
                                                  backgroundColor: Colors.white,
                                                  child: const Icon(Icons.remove, color: Colors.black87),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),

                  _buildSectionCard(
                    title: 'E. DATA BANGUNAN',
                    children: [
                      if (tx?['detail_tujuan'] != null &&
                          (tx!['detail_tujuan'] as List).isNotEmpty)
                        Builder(
                          builder: (context) {
                            final tujuan = tx!['detail_tujuan'][0];
                            final List bangunan =
                                tujuan['data_bangunan_json'] ?? [];
                            if (bangunan.isEmpty) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                child: Text(
                                  'Tidak ada data bangunan.',
                                  style: TextStyle(
                                    color: Colors.grey.shade600,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              );
                            }
                            return Column(
                              children: bangunan.asMap().entries.map((entry) {
                                final idx = entry.key;
                                final b = entry.value;
                                return Container(
                                  margin: EdgeInsets.only(
                                    bottom: idx == bangunan.length - 1 ? 0 : 16,
                                    left: 16,
                                    right: 16,
                                  ),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.grey.shade200),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 8,
                                          horizontal: 16,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.blue.shade50,
                                          borderRadius: const BorderRadius.vertical(top: Radius.circular(8)),
                                        ),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              'BANGUNAN KE-${idx + 1}',
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12,
                                                color: Colors.blue.shade900,
                                              ),
                                            ),
                                            Text(
                                              "1 UNIT (${_fmt(b['luas_bangunan'] ?? b['luasBangunan'] ?? 0)} m²)",
                                              style: TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12,
                                                color: Colors.blue.shade900,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      _buildGridRow([
                                        {'label': 'Penggunaan', 'value': _fmt(b['jenisPenggunaan'] ?? b['kode_jpb'] ?? b['jenis_penggunaan_bangunan'] ?? b['penggunaan'] ?? b['jenisPenggunaanBangunan'])},
                                        {'label': 'Kondisi', 'value': _fmt(b['kondisi_bangunan'] ?? b['kondisiBangunan'] ?? b['kondisi'])},
                                      ]),
                                      _buildGridRow([
                                        {'label': 'Luas Bangunan', 'value': '${_fmt(b['luas_bangunan'] ?? b['luasBangunan'] ?? 0)} m²'},
                                        {'label': 'Atap', 'value': _fmt(b['atap'])},
                                      ]),
                                      _buildGridRow([
                                        {'label': 'Jumlah Lantai', 'value': _fmt(b['jumlah_lantai'] ?? b['jumlahLantai'] ?? 1)},
                                        {'label': 'Dinding', 'value': _fmt(b['dinding'])},
                                      ]),
                                      _buildGridRow([
                                        {'label': 'Tahun Dibangun', 'value': _fmt(b['tahun_dibangun'] ?? b['tahunDibangun'] ?? b['tahun_bangun'])},
                                        {'label': 'Lantai', 'value': _fmt(b['lantai'])},
                                      ]),
                                      _buildGridRow([
                                        {'label': 'Tahun Renovasi', 'value': _fmt(b['tahun_renovasi'] ?? b['tahunRenovasi'] ?? b['tahun_direnovasi'] ?? b['tahunDirenovasi'] ?? '0')},
                                        {'label': 'Langit-langit', 'value': _fmt(b['langit_langit'] ?? b['langitLangit'])},
                                      ]),
                                      _buildGridRow([
                                        {'label': 'Konstruksi', 'value': _fmt(b['konstruksi'])},
                                        {'label': 'Daya Listrik', 'value': "${_fmt(b['daya_listrik'] ?? b['dayaListrik'] ?? 0)} Watt"},
                                      ]),
                                    ],
                                  ),
                                );
                              }).toList(),
                            );
                          },
                        ),
                    ],
                  ),

                  _buildSectionCard(
                    title: 'F. LAMPIRAN DOKUMEN',
                    children: [
                      if (tx?['lampiran'] != null)
                        Builder(
                          builder: (context) {
                            final lampiranData = tx!['lampiran'];
                            final List lampiransRaw = lampiranData is List ? lampiranData : (lampiranData is Map ? [lampiranData] : []);
                            final List lampirans = lampiransRaw.where((l) {
                              final url = l['url_file']?.toString() ?? '';
                              return url.trim().isNotEmpty && url != 'null';
                            }).toList();

                            if (lampirans.isEmpty) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                child: Text(
                                  'Tidak ada lampiran dokumen yang valid.',
                                  style: TextStyle(color: Colors.grey.shade600, fontStyle: FontStyle.italic),
                                ),
                              );
                            }
                            return Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                    decoration: BoxDecoration(color: Colors.blue.shade50, border: Border.all(color: Colors.grey.shade300)),
                                    child: const Row(
                                      children: [
                                        SizedBox(
                                          width: 30,
                                          child: Text('No.', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                                        ),
                                        Expanded(
                                          child: Text('Jenis Dokumen', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                                        ),
                                        SizedBox(
                                          width: 80,
                                          child: Text('Aksi', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black87)),
                                        ),
                                      ],
                                    ),
                                  ),
                                  ...lampirans.asMap().entries.map((entry) {
                                    final idx = entry.key;
                                    final l = entry.value;
                                    final url = l['url_file']?.toString() ?? '';
                                    final isImage = url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg');
                                    return Container(
                                      decoration: BoxDecoration(
                                        border: Border(
                                          left: BorderSide(color: Colors.grey.shade300),
                                          right: BorderSide(color: Colors.grey.shade300),
                                          bottom: BorderSide(color: Colors.grey.shade300),
                                        ),
                                      ),
                                      child: Column(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                                            child: Row(
                                              children: [
                                                SizedBox(
                                                  width: 30,
                                                  child: Text('${idx + 1}', style: const TextStyle(fontSize: 12)),
                                                ),
                                                Expanded(
                                                  child: Text(_fmt(l['jenis_dokumen']), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                                ),
                                                SizedBox(
                                                  width: 80,
                                                  child: ElevatedButton(
                                                    onPressed: () async {
                                                      if (url.isNotEmpty) {
                                                        final uri = Uri.tryParse(url);
                                                        if (uri != null && await canLaunchUrl(uri)) {
                                                          await launchUrl(uri, mode: LaunchMode.externalApplication);
                                                        } else {
                                                          if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tidak dapat membuka dokumen.')));
                                                        }
                                                      }
                                                    },
                                                    style: ElevatedButton.styleFrom(
                                                      backgroundColor: Colors.blue.shade700,
                                                      foregroundColor: Colors.white,
                                                      padding: EdgeInsets.zero,
                                                      minimumSize: const Size(60, 30),
                                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                                    ),
                                                    child: const Text('LIHAT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          if (isImage)
                                            GestureDetector(
                                              onTap: () {
                                                showDialog(
                                                  context: context,
                                                  builder: (ctx) => Dialog(
                                                    backgroundColor: Colors.transparent,
                                                    insetPadding: EdgeInsets.zero,
                                                    child: Stack(
                                                      alignment: Alignment.center,
                                                      children: [
                                                        InteractiveViewer(
                                                          child: Image.network(
                                                            url,
                                                            fit: BoxFit.contain,
                                                            errorBuilder: (c, e, s) => Container(
                                                              color: Colors.white,
                                                              padding: const EdgeInsets.all(32),
                                                              child: const Text('Gambar tidak dapat dimuat (URL tidak valid atau file rusak)', textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
                                                            ),
                                                          ),
                                                        ),
                                                        Positioned(
                                                          top: 20,
                                                          right: 20,
                                                          child: IconButton(icon: const Icon(Icons.close, color: Colors.white, size: 30), onPressed: () => Navigator.pop(ctx)),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                                );
                                              },
                                              child: Padding(
                                                padding: const EdgeInsets.all(16.0),
                                                child: Image.network(
                                                  url,
                                                  height: 250,
                                                  fit: BoxFit.contain,
                                                  errorBuilder: (c, e, s) => const Padding(
                                                    padding: EdgeInsets.symmetric(vertical: 32),
                                                    child: Text('File gambar tidak tersedia atau URL rusak', style: TextStyle(color: Colors.grey, fontStyle: FontStyle.italic)),
                                                  ),
                                                ),
                                              ),
                                            )
                                          else
                                            const Padding(padding: EdgeInsets.all(16.0), child: Text('Dokumen PDF (Buka di Web)')),
                                        ],
                                      ),
                                    );
                                  }),
                                ],
                              ),
                            );
                          },
                        )
                      else
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Text('Tidak ada lampiran dokumen.', style: TextStyle(color: Colors.grey.shade600, fontStyle: FontStyle.italic)),
                        ),
                    ],
                  ),

                  const Divider(thickness: 1, height: 32),
                  // Riwayat
                  if (tx?['riwayat_pelacakan'] != null &&
                      (tx!['riwayat_pelacakan'] as List).isNotEmpty)
                    _buildSectionCard(
                      title: 'G. RIWAYAT PROSES',
                      children: [
                        ...((tx['riwayat_pelacakan'] as List).map(
                          (r) => ListTile(
                            dense: true,
                            leading: const Icon(
                              Icons.history,
                              color: Colors.grey,
                            ),
                            title: Text(
                              _fmt(r['keterangan']),
                              style: const TextStyle(fontSize: 14),
                            ),
                            subtitle: Text(
                              _fmtDate(r['created_at']),
                              style: const TextStyle(fontSize: 12),
                            ),
                          ),
                        )),
                      ],
                    ),

                  const SizedBox(height: 16),

                  if ([
                    'DISETUJUI',
                    'DITOLAK',
                    'MENUNGGU_REVISI',
                    'REVISI',
                  ].contains(tx?['status_ajuan']))
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(
                            color: tx!['status_ajuan'] == 'DISETUJUI' ? Colors.green.shade700 : (tx['status_ajuan'] == 'DITOLAK' ? Colors.red.shade700 : Colors.orange.shade700),
                            width: 1.5,
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  tx['status_ajuan'] == 'DISETUJUI' ? Icons.check_circle : (tx['status_ajuan'] == 'DITOLAK' ? Icons.cancel : Icons.info),
                                  color: tx['status_ajuan'] == 'DISETUJUI' ? Colors.green.shade700 : (tx['status_ajuan'] == 'DITOLAK' ? Colors.red.shade700 : Colors.orange.shade700),
                                  size: 28,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    'Berkas ${tx['status_ajuan'] == 'DISETUJUI' ? 'telah disetujui' : (tx['status_ajuan'] == 'DITOLAK' ? 'ditolak permanen' : 'dikembalikan untuk revisi')}',
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Diverifikasi oleh',
                                        style: TextStyle(fontSize: 12, color: Colors.grey, decoration: TextDecoration.underline),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _fmt(tx['verifikator']?['nama_lengkap'] ?? 'Admin Bakeuda'),
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                                      ),
                                    ],
                                  ),
                                ),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Waktu keputusan',
                                        style: TextStyle(fontSize: 12, color: Colors.grey, decoration: TextDecoration.underline),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _fmtDate(tx['verified_at']),
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            if (tx['catatan_bakeuda'] != null && tx['catatan_bakeuda'].toString().trim().isNotEmpty) ...[
                              const SizedBox(height: 16),
                              const Text(
                                'Catatan tambahan',
                                style: TextStyle(fontSize: 12, color: Colors.grey, decoration: TextDecoration.underline),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  _fmt(tx['catatan_bakeuda']),
                                  style: const TextStyle(fontSize: 14, color: Colors.black87),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),

                  const SizedBox(height: 16),

                  // KEPUTUSAN VERIFIKASI
                  if (!widget.isReadOnly && canVerify) ...[
                    const Divider(thickness: 1, height: 32),
                    _buildBlueHeader('G. KEPUTUSAN VERIFIKASI'),

                    if (_transaksi?['jenis_transaksi'] == 'BARU' ||
                        _transaksi?['jenis_transaksi'] == 'PECAH' ||
                        _transaksi?['jenis_transaksi'] == 'GABUNG')
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9F9F9),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(
                                    Icons.map_outlined,
                                    color: Color(0xFF0C2A5B),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Penetapan NOP baru',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Pastikan kecamatan dan desa sudah benar.\nCukup isi kode blok.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.black54,
                                  height: 1.3,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Expanded(
                                    child: Builder(
                                      builder: (context) {
                                        final kec =
                                            tx?['detail_tujuan'] != null &&
                                                (tx!['detail_tujuan'] as List)
                                                    .isNotEmpty
                                            ? tx!['detail_tujuan'][0]['kecamatan_op_baru'] ??
                                                  '-'
                                            : '-';
                                        return Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            const Text(
                                              'Kecamatan',
                                              style: TextStyle(
                                                fontSize: 11,
                                                color: Colors.black54,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            TextField(
                                              decoration: InputDecoration(
                                                border: OutlineInputBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(8),
                                                  borderSide: BorderSide(
                                                    color: Colors.grey.shade300,
                                                  ),
                                                ),
                                                enabledBorder:
                                                    OutlineInputBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            8,
                                                          ),
                                                      borderSide: BorderSide(
                                                        color: Colors
                                                            .grey
                                                            .shade300,
                                                      ),
                                                    ),
                                                isDense: true,
                                                filled: true,
                                                fillColor: Colors.white,
                                                contentPadding:
                                                    const EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 10,
                                                    ),
                                              ),
                                              enabled: false,
                                              controller: TextEditingController(
                                                text: kec,
                                              ),
                                              style: const TextStyle(
                                                fontSize: 13,
                                                color: Colors.black87,
                                              ),
                                            ),
                                          ],
                                        );
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Builder(
                                      builder: (context) {
                                        final kel =
                                            tx?['detail_tujuan'] != null &&
                                                (tx!['detail_tujuan'] as List)
                                                    .isNotEmpty
                                            ? tx!['detail_tujuan'][0]['kelurahan_op_baru'] ??
                                                  '-'
                                            : '-';
                                        return Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            const Text(
                                              'Desa/kel',
                                              style: TextStyle(
                                                fontSize: 11,
                                                color: Colors.black54,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            TextField(
                                              decoration: InputDecoration(
                                                border: OutlineInputBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(8),
                                                  borderSide: BorderSide(
                                                    color: Colors.grey.shade300,
                                                  ),
                                                ),
                                                enabledBorder:
                                                    OutlineInputBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            8,
                                                          ),
                                                      borderSide: BorderSide(
                                                        color: Colors
                                                            .grey
                                                            .shade300,
                                                      ),
                                                    ),
                                                isDense: true,
                                                filled: true,
                                                fillColor: Colors.white,
                                                contentPadding:
                                                    const EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 10,
                                                    ),
                                              ),
                                              enabled: false,
                                              controller: TextEditingController(
                                                text: kel,
                                              ),
                                              style: const TextStyle(
                                                fontSize: 13,
                                                color: Colors.black87,
                                              ),
                                            ),
                                          ],
                                        );
                                      },
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    flex: 1,
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Kode blok',
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Colors.black54,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        TextField(
                                          decoration: InputDecoration(
                                            border: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              borderSide: BorderSide(
                                                color: Colors.grey.shade300,
                                              ),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              borderSide: BorderSide(
                                                color: Colors.grey.shade300,
                                              ),
                                            ),
                                            focusedBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              borderSide: const BorderSide(
                                                color: Color(0xFF0C2A5B),
                                              ),
                                            ),
                                            isDense: true,
                                            filled: true,
                                            fillColor: Colors.white,
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                  horizontal: 12,
                                                  vertical: 12,
                                                ),
                                            counterText: '',
                                            hintText: '001',
                                            hintStyle: TextStyle(
                                              color: Colors.grey.shade400,
                                            ),
                                          ),
                                          keyboardType: TextInputType.number,
                                          maxLength: 3,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            color: Colors.black87,
                                          ),
                                          onChanged: (val) =>
                                              setState(() => _kodeBlok = val),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    flex: 1,
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Jenis OP',
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Colors.black54,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Container(
                                          height: 40,
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                            border: Border.all(
                                              color: Colors.grey.shade200,
                                            ),
                                          ),
                                          child: Row(
                                            children: [
                                              Expanded(
                                                child: GestureDetector(
                                                  onTap: () => setState(
                                                    () => _kodeJenisOp = '0',
                                                  ),
                                                  child: Container(
                                                    decoration: BoxDecoration(
                                                      color: _kodeJenisOp == '0'
                                                          ? const Color(
                                                              0xFF0C2A5B,
                                                            )
                                                          : Colors.transparent,
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            7,
                                                          ),
                                                    ),
                                                    alignment: Alignment.center,
                                                    child: Text(
                                                      'Bumi',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        fontWeight:
                                                            _kodeJenisOp == '0'
                                                            ? FontWeight.bold
                                                            : FontWeight.normal,
                                                        color:
                                                            _kodeJenisOp == '0'
                                                            ? Colors.white
                                                            : Colors.black87,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Expanded(
                                                child: GestureDetector(
                                                  onTap: () => setState(
                                                    () => _kodeJenisOp = '1',
                                                  ),
                                                  child: Container(
                                                    decoration: BoxDecoration(
                                                      color: _kodeJenisOp == '1'
                                                          ? const Color(
                                                              0xFF0C2A5B,
                                                            )
                                                          : Colors.transparent,
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            7,
                                                          ),
                                                    ),
                                                    alignment: Alignment.center,
                                                    child: Text(
                                                      'Bgn',
                                                      style: TextStyle(
                                                        fontSize: 12,
                                                        fontWeight:
                                                            _kodeJenisOp == '1'
                                                            ? FontWeight.bold
                                                            : FontWeight.normal,
                                                        color:
                                                            _kodeJenisOp == '1'
                                                            ? Colors.white
                                                            : Colors.black87,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Divider(color: Colors.grey.shade300, height: 1),
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Preview NOP',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '33.03.010.001.${_kodeBlok.isEmpty ? '___' : _kodeBlok.padRight(3, '_')}.AUTO.0',
                                style: const TextStyle(
                                  fontSize: 13,
                                  letterSpacing: 1.0,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Catatan verifikasi dipindah ke dalam kotak abu
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF9F9F9),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Catatan verifikasi',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                TextField(
                                  controller: _catatanController,
                                  maxLines: 4,
                                  decoration: InputDecoration(
                                    hintText:
                                        'Bagian subjek: ...\nBagian objek: ...',
                                    hintStyle: TextStyle(
                                      fontSize: 13,
                                      color: Colors.grey.shade500,
                                      height: 1.3,
                                    ),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: BorderSide(
                                        color: Colors.grey.shade300,
                                      ),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: BorderSide(
                                        color: Colors.grey.shade300,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(8),
                                      borderSide: const BorderSide(
                                        color: Color(0xFF0C2A5B),
                                      ),
                                    ),
                                    filled: true,
                                    fillColor: Colors.white,
                                    contentPadding: const EdgeInsets.all(12),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),

                          if (_isProcessing)
                            const Center(
                              child: Padding(
                                padding: EdgeInsets.all(16),
                                child: CircularProgressIndicator(),
                              ),
                            )
                          else
                            Column(
                              children: [
                                // Tombol Setujui - full width, solid navy
                                SizedBox(
                                  width: double.infinity,
                                  height: 52,
                                  child: ElevatedButton.icon(
                                    onPressed: _prosesApprove,
                                    icon: const Icon(
                                      Icons.check_circle_outline_rounded,
                                      size: 20,
                                    ),
                                    label: const Text(
                                      'Setujui pengajuan',
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF0C2A5B),
                                      foregroundColor: Colors.white,
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                // Tombol Revisi dan Tolak - berdampingan
                                Row(
                                  children: [
                                    Expanded(
                                      child: SizedBox(
                                        height: 46,
                                        child: OutlinedButton.icon(
                                          onPressed: _prosesRevisi,
                                          icon: const Icon(
                                            Icons.undo_rounded,
                                            size: 18,
                                          ),
                                          label: const Text(
                                            'Revisi',
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: Colors.black87,
                                            side: BorderSide(
                                              color: Colors.grey.shade300,
                                              width: 1.5,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: SizedBox(
                                        height: 46,
                                        child: OutlinedButton.icon(
                                          onPressed: _prosesTolak,
                                          icon: const Icon(
                                            Icons.block_rounded,
                                            size: 18,
                                          ),
                                          label: const Text(
                                            'Tolak',
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor:
                                                Colors.red.shade700,
                                            side: BorderSide(
                                              color: Colors.red.shade300,
                                              width: 1.5,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 40),
                ],
              ),
            ),
    );
  }
}
