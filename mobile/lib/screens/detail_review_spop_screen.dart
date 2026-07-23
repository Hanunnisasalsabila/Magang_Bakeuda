import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
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
      if (mounted) Navigator.pop(context, true);
    } on DioException catch (e) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              e.response?.data?['message'] ?? 'Gagal memproses verifikasi',
            ),
            backgroundColor: Colors.red,
          ),
        );
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
      await _spopService.revisiSpop(
        widget.idTransaksi,
        _catatanController.text.trim(),
      );
      if (mounted) Navigator.pop(context, true);
    } on DioException catch (e) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.response?.data?['message'] ?? 'Gagal'),
            backgroundColor: Colors.red,
          ),
        );
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
      await _spopService.tolakSpop(
        widget.idTransaksi,
        _catatanController.text.trim(),
      );
      if (mounted) Navigator.pop(context, true);
    } on DioException catch (e) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.response?.data?['message'] ?? 'Gagal'),
            backgroundColor: Colors.red,
          ),
        );
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Widget _buildBlueHeader(String title) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        border: Border(
          bottom: BorderSide(color: Colors.blue.shade200, width: 1),
        ),
      ),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Colors.blue.shade900,
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
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
          ),
          const SizedBox(width: 8),
          const Text(
            ':',
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 3,
            child: Text(value, style: const TextStyle(color: Colors.black87)),
          ),
        ],
      ),
    );
  }

  String _fmt(dynamic v) => v?.toString() ?? '-';
  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try {
      return DateFormat('dd MMM yyyy, HH:mm', 'id').format(DateTime.parse(iso));
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
            tx['status_ajuan'] == 'SEDANG_DITINJAU');

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
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
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

                  _buildBlueHeader('A. NOMOR OBJEK PAJAK (NOP BARU)'),
                  _buildDataRow('Nomor Objek Pajak', _fmt(tx?['nop_bersama'])),
                  _buildDataRow(
                    'Format NOP',
                    'Prov - Kab - Kec - Kel - Blok - No.Urut - Kode',
                  ),
                  const Divider(thickness: 1, height: 32),

                  _buildBlueHeader('B. DATA PENGAJUAN / SUBJEK PAJAK'),
                  if (tx?['detail_tujuan'] != null &&
                      (tx!['detail_tujuan'] as List).isNotEmpty) ...[
                    Builder(
                      builder: (context) {
                        final subjek =
                            tx!['detail_tujuan'][0]['calon_subjek_json'] ?? {};
                        final tujuan = tx['detail_tujuan'][0];
                        final nama =
                            subjek['nama_subjek'] ??
                            tx['nama_pengaju'] ??
                            tx['pengaju']?['nama_lengkap'] ??
                            '-';
                        final nik =
                            subjek['nik'] ??
                            subjek['npwp'] ??
                            tujuan['nik_calon_subjek'] ??
                            '-';
                        final alamat =
                            subjek['alamat_jalan'] ?? subjek['alamat'] ?? '-';
                        final rt = subjek['rt'] ?? '-';
                        final rw = subjek['rw'] ?? '-';
                        final kel = subjek['kelurahan'] ?? '-';
                        final kec = subjek['kecamatan'] ?? '-';
                        final kab = subjek['kabupaten'] ?? 'Purbalingga';

                        return Column(
                          children: [
                            _buildDataRow('Nama Subjek Pajak', _fmt(nama)),
                            _buildDataRow(
                              'Status Subjek',
                              _fmt(
                                subjek['status_wp'] ?? subjek['status_subjek'],
                              ),
                            ),
                            _buildDataRow('NIK / NPWP', _fmt(nik)),
                            _buildDataRow(
                              'Pekerjaan',
                              _fmt(subjek['pekerjaan']),
                            ),
                            _buildDataRow(
                              'No. Telepon/HP',
                              _fmt(subjek['no_hp']),
                            ),
                            _buildDataRow(
                              'Alamat WP',
                              '$alamat, RT $rt/RW $rw\nKEL. $kel, KEC. $kec\nKAB. $kab',
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                  _buildDataRow('No. SPPT Lama', _fmt(tx?['no_sppt_lama'])),
                  _buildDataRow('Tahun Pajak', _fmt(tx?['tahun_pajak'])),
                  const Divider(thickness: 1, height: 32),
                  _buildBlueHeader('C. DATA OBJEK PAJAK (TANAH)'),
                  if (tx?['detail_tujuan'] != null &&
                      (tx!['detail_tujuan'] as List).isNotEmpty) ...[
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

                        return Table(
                          border: TableBorder.all(color: Colors.grey.shade200),
                          columnWidths: const {
                            0: FlexColumnWidth(1),
                            1: FlexColumnWidth(1.2),
                            2: FlexColumnWidth(1),
                            3: FlexColumnWidth(1.5),
                          },
                          children: [
                            TableRow(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  color: Colors.grey.shade50,
                                  child: const Text(
                                    'Luas Tanah',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: Text(
                                    '${_fmt(tujuan['luas_tanah_baru'] ?? 0)} m²',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  color: Colors.grey.shade50,
                                  child: const Text(
                                    'Letak Objek',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: Text(
                                    '$jalan $blok\nRT $rt/RW $rw\nDESA $kel, KEC. $kec',
                                    style: const TextStyle(fontSize: 11),
                                  ),
                                ),
                              ],
                            ),
                            TableRow(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  color: Colors.grey.shade50,
                                  child: const Text(
                                    'Jenis Tanah',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: Text(
                                    _fmt(tujuan['jenis_tanah_baru']),
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  color: Colors.grey.shade50,
                                  child: const Text(
                                    '',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black54,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  child: const Text(
                                    '',
                                    style: TextStyle(fontSize: 11),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        );
                      },
                    ),
                  ],

                  _buildBlueHeader('D. LOKASI OBJEK / PETA BIDANG'),
                  Builder(
                    builder: (context) {
                      final tujuan =
                          (tx?['detail_tujuan'] != null &&
                              (tx!['detail_tujuan'] as List).isNotEmpty)
                          ? tx!['detail_tujuan'][0]
                          : null;
                      final List polyRaw = tujuan?['koordinat_polygon'] ?? [];

                      if (polyRaw.isEmpty) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
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
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
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
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 16,
                        ),
                        child: Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                color: Colors.grey.shade50,
                                child: Wrap(
                                  spacing: 4,
                                  runSpacing: 4,
                                  children: points.asMap().entries.map((e) {
                                    return Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: Colors.grey.shade300,
                                        ),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        'P${e.key + 1}: ${e.value.latitude.toStringAsFixed(6)}, ${e.value.longitude.toStringAsFixed(6)}',
                                        style: const TextStyle(
                                          fontSize: 8,
                                          color: Colors.black54,
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                              SizedBox(
                                height: 250,
                                child: Stack(
                                  children: [
                                    FlutterMap(
                                      options: MapOptions(
                                        initialCenter: center,
                                        initialZoom: 16.0,
                                        maxZoom: 22.0,
                                        interactionOptions:
                                            const InteractionOptions(
                                              flags:
                                                  InteractiveFlag.all &
                                                  ~InteractiveFlag.rotate,
                                            ),
                                      ),
                                      children: [
                                        TileLayer(
                                          urlTemplate: _isSatellite
                                              ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                              : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                                          userAgentPackageName:
                                              'com.example.magang_bakeuda',
                                          maxZoom: 22,
                                        ),
                                        PolygonLayer(
                                          polygons: [
                                            Polygon(
                                              points: points,
                                              color: Colors.blue.withOpacity(
                                                0.3,
                                              ),
                                              borderColor: Colors.blue,
                                              borderStrokeWidth: 2,
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    Positioned(
                                      top: 10,
                                      right: 10,
                                      child: FloatingActionButton.small(
                                        onPressed: () => setState(
                                          () => _isSatellite = !_isSatellite,
                                        ),
                                        backgroundColor: Colors.white,
                                        child: Icon(
                                          _isSatellite
                                              ? Icons.map_outlined
                                              : Icons.satellite_alt_outlined,
                                          color: Colors.blue,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  _buildBlueHeader('E. DATA BANGUNAN'),
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
                            return Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 8,
                                    horizontal: 16,
                                  ),
                                  color: Colors.blue.shade50,
                                  width: double.infinity,
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
                                Table(
                                  border: TableBorder.all(
                                    color: Colors.grey.shade200,
                                  ),
                                  columnWidths: const {
                                    0: FlexColumnWidth(1),
                                    1: FlexColumnWidth(1.2),
                                    2: FlexColumnWidth(1),
                                    3: FlexColumnWidth(1.2),
                                  },
                                  children: [
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Penggunaan',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(
                                              b['penggunaan'] ??
                                                  b['jenisPenggunaanBangunan'],
                                            ),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Konstruksi',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(b['konstruksi']),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Luas Bangunan',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            "${_fmt(b['luas_bangunan'] ?? b['luasBangunan'] ?? 0)} m²",
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Atap',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(b['atap']),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Jumlah Lantai',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(
                                              b['jumlah_lantai'] ??
                                                  b['jumlahLantai'] ??
                                                  1,
                                            ),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Dinding',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(b['dinding']),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Tahun Dibangun',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(
                                              b['tahun_dibangun'] ??
                                                  b['tahunDibangun'],
                                            ),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Lantai',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(b['lantai']),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Tahun Renovasi',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(
                                              b['tahun_direnovasi'] ??
                                                  b['tahunDirenovasi'],
                                            ),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Langit-Langit',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(
                                              b['langit_langit'] ??
                                                  b['langitLangit'],
                                            ),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    TableRow(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Kondisi',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            _fmt(b['kondisi']),
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          color: Colors.grey.shade50,
                                          child: const Text(
                                            'Daya Listrik',
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.black54,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Text(
                                            "${_fmt(b['daya_listrik'] ?? b['dayaListrik'] ?? 0)} Watt",
                                            style: const TextStyle(
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                              ],
                            );
                          }).toList(),
                        );
                      },
                    ),

                  _buildBlueHeader('F. LAMPIRAN DOKUMEN'),
                  if (tx?['lampiran'] != null &&
                      (tx!['lampiran'] as List).isNotEmpty)
                    Builder(
                      builder: (context) {
                        final List lampiransRaw = tx!['lampiran'];
                        final List lampirans = lampiransRaw.where((l) {
                          final url = l['url_file']?.toString() ?? '';
                          return url.trim().isNotEmpty && url != 'null';
                        }).toList();

                        if (lampirans.isEmpty) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            child: Text(
                              'Tidak ada lampiran dokumen yang valid.',
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          );
                        }
                        return Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          child: Column(
                            children: [
                              // Table Header
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 8,
                                  horizontal: 12,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.blue.shade50,
                                  border: Border.all(
                                    color: Colors.grey.shade300,
                                  ),
                                ),
                                child: const Row(
                                  children: [
                                    SizedBox(
                                      width: 30,
                                      child: Text(
                                        'No.',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        'Jenis Dokumen',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      width: 80,
                                      child: Text(
                                        'Aksi',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Table Rows
                              ...lampirans.asMap().entries.map((entry) {
                                final idx = entry.key;
                                final l = entry.value;
                                final url = l['url_file']?.toString() ?? '';
                                final isImage =
                                    url.toLowerCase().endsWith('.png') ||
                                    url.toLowerCase().endsWith('.jpg') ||
                                    url.toLowerCase().endsWith('.jpeg');
                                return Container(
                                  decoration: BoxDecoration(
                                    border: Border(
                                      left: BorderSide(
                                        color: Colors.grey.shade300,
                                      ),
                                      right: BorderSide(
                                        color: Colors.grey.shade300,
                                      ),
                                      bottom: BorderSide(
                                        color: Colors.grey.shade300,
                                      ),
                                    ),
                                  ),
                                  child: Column(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          vertical: 12,
                                          horizontal: 12,
                                        ),
                                        child: Row(
                                          children: [
                                            SizedBox(
                                              width: 30,
                                              child: Text(
                                                '${idx + 1}',
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                            Expanded(
                                              child: Text(
                                                _fmt(l['jenis_dokumen']),
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                            SizedBox(
                                              width: 80,
                                              child: ElevatedButton(
                                                onPressed: () {},
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor:
                                                      Colors.blue.shade700,
                                                  foregroundColor: Colors.white,
                                                  padding: EdgeInsets.zero,
                                                  minimumSize: const Size(
                                                    60,
                                                    30,
                                                  ),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          4,
                                                        ),
                                                  ),
                                                ),
                                                child: const Text(
                                                  'LIHAT',
                                                  style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
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
                                                backgroundColor:
                                                    Colors.transparent,
                                                insetPadding: EdgeInsets.zero,
                                                child: Stack(
                                                  alignment: Alignment.center,
                                                  children: [
                                                    InteractiveViewer(
                                                      child: Image.network(
                                                        url,
                                                        fit: BoxFit.contain,
                                                        errorBuilder:
                                                            (
                                                              c,
                                                              e,
                                                              s,
                                                            ) => Container(
                                                              color:
                                                                  Colors.white,
                                                              padding:
                                                                  const EdgeInsets.all(
                                                                    32,
                                                                  ),
                                                              child: const Text(
                                                                'Gambar tidak dapat dimuat (URL tidak valid atau file rusak)',
                                                                textAlign:
                                                                    TextAlign
                                                                        .center,
                                                                style: TextStyle(
                                                                  color: Colors
                                                                      .grey,
                                                                ),
                                                              ),
                                                            ),
                                                      ),
                                                    ),
                                                    Positioned(
                                                      top: 20,
                                                      right: 20,
                                                      child: IconButton(
                                                        icon: const Icon(
                                                          Icons.close,
                                                          color: Colors.white,
                                                          size: 30,
                                                        ),
                                                        onPressed: () =>
                                                            Navigator.pop(ctx),
                                                      ),
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
                                              errorBuilder: (c, e, s) =>
                                                  const Padding(
                                                    padding:
                                                        EdgeInsets.symmetric(
                                                          vertical: 32,
                                                        ),
                                                    child: Text(
                                                      'File gambar tidak tersedia atau URL rusak',
                                                      style: TextStyle(
                                                        color: Colors.grey,
                                                        fontStyle:
                                                            FontStyle.italic,
                                                      ),
                                                    ),
                                                  ),
                                            ),
                                          ),
                                        )
                                      else
                                        const Padding(
                                          padding: EdgeInsets.all(16.0),
                                          child: Text(
                                            'Dokumen PDF (Buka di Web)',
                                          ),
                                        ),
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
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: Text(
                        'Tidak ada lampiran dokumen.',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),

                  const Divider(thickness: 1, height: 32),
                  // Riwayat
                  if (tx?['riwayat_pelacakan'] != null &&
                      (tx!['riwayat_pelacakan'] as List).isNotEmpty)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildBlueHeader('G. RIWAYAT PROSES'),
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

                  // KEPUTUSAN VERIFIKASI
                  if (!widget.isReadOnly && canVerify) ...[
                    const Divider(thickness: 1, height: 32),
                    _buildBlueHeader('H. KEPUTUSAN VERIFIKASI'),

                    if (_transaksi?['jenis_transaksi'] == 'BARU' ||
                        _transaksi?['jenis_transaksi'] == 'PECAH' ||
                        _transaksi?['jenis_transaksi'] == 'GABUNG')
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            border: Border.all(color: Colors.blue.shade200),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'PENETAPAN NOP BARU',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Pastikan Kecamatan dan Desa sudah benar. Anda hanya perlu mengisi Kode Blok. Nomor Urut akan dihitung otomatis oleh sistem.',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.blue,
                                ),
                              ),
                              const SizedBox(height: 12),
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
                                        return TextField(
                                          decoration: const InputDecoration(
                                            labelText: 'KECAMATAN',
                                            border: OutlineInputBorder(),
                                            isDense: true,
                                            filled: true,
                                            fillColor: Colors.white,
                                          ),
                                          enabled: false,
                                          controller: TextEditingController(
                                            text: kec,
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                  const SizedBox(width: 8),
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
                                        return TextField(
                                          decoration: const InputDecoration(
                                            labelText: 'DESA/KEL',
                                            border: OutlineInputBorder(),
                                            isDense: true,
                                            filled: true,
                                            fillColor: Colors.white,
                                          ),
                                          enabled: false,
                                          controller: TextEditingController(
                                            text: kel,
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      decoration: const InputDecoration(
                                        labelText: 'KODE BLOK (3 DIGIT) *',
                                        border: OutlineInputBorder(),
                                        isDense: true,
                                        filled: true,
                                        fillColor: Colors.white,
                                      ),
                                      keyboardType: TextInputType.number,
                                      maxLength: 3,
                                      onChanged: (val) =>
                                          setState(() => _kodeBlok = val),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'KODE JENIS OP',
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.black54,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        ToggleButtons(
                                          isSelected: [
                                            _kodeJenisOp == '0',
                                            _kodeJenisOp == '1',
                                          ],
                                          onPressed: (idx) => setState(
                                            () => _kodeJenisOp = idx.toString(),
                                          ),
                                          fillColor: Colors.blue.shade50,
                                          selectedColor: Colors.blue.shade700,
                                          color: Colors.black87,
                                          borderRadius: BorderRadius.circular(
                                            4,
                                          ),
                                          constraints: const BoxConstraints(
                                            minHeight: 36,
                                            minWidth: 60,
                                          ),
                                          children: const [
                                            Padding(
                                              padding: EdgeInsets.symmetric(
                                                horizontal: 8,
                                              ),
                                              child: Text(
                                                '0 - Bumi',
                                                style: TextStyle(fontSize: 12),
                                              ),
                                            ),
                                            Padding(
                                              padding: EdgeInsets.symmetric(
                                                horizontal: 8,
                                              ),
                                              child: Text(
                                                '1 - Bangunan',
                                                style: TextStyle(fontSize: 12),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  border: Border.all(
                                    color: Colors.grey.shade200,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        'PREVIEW NOP: 33.03.010.001.${_kodeBlok.isEmpty ? '___' : _kodeBlok}.AUTO.0',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.blue,
                                        ),
                                      ),
                                    ),
                                    const Text(
                                      '  (No. Urut otomatis)',
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: Colors.black54,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'CATATAN / ALASAN VERIFIKASI',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                              color: Colors.black54,
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _catatanController,
                            maxLines: 4,
                            decoration: const InputDecoration(
                              hintText:
                                  'Contoh:\nBagian Subjek: ...\nBagian Objek: ...\nBagian Lampiran: ...',
                              border: OutlineInputBorder(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_isProcessing)
                            const Center(child: CircularProgressIndicator())
                          else
                            Column(
                              children: [
                                SizedBox(
                                  width: double.infinity,
                                  child: OutlinedButton.icon(
                                    onPressed: _prosesApprove,
                                    icon: const Icon(
                                      Icons.check_circle_outline,
                                      size: 18,
                                    ),
                                    label: const Text('Setujui Pengajuan'),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: Colors.blue.shade700,
                                      side: BorderSide(
                                        color: Colors.blue.shade200,
                                        width: 2,
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 14,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: _prosesRevisi,
                                        icon: const Icon(Icons.undo, size: 18),
                                        label: const Text(
                                          'Kembalikan untuk Revisi',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor:
                                              Colors.orange.shade700,
                                          side: BorderSide(
                                            color: Colors.orange.shade200,
                                            width: 2,
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 14,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: _prosesTolak,
                                        icon: const Icon(
                                          Icons.cancel_outlined,
                                          size: 18,
                                        ),
                                        label: const Text(
                                          'Tolak Permanen',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(fontSize: 12),
                                        ),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: Colors.red.shade700,
                                          side: BorderSide(
                                            color: Colors.red.shade200,
                                            width: 2,
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 14,
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
