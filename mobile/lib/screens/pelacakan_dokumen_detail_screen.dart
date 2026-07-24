import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';

class PelacakanDokumenDetailScreen extends StatefulWidget {
  final String idTransaksi;

  const PelacakanDokumenDetailScreen({super.key, required this.idTransaksi});

  @override
  State<PelacakanDokumenDetailScreen> createState() => _PelacakanDokumenDetailScreenState();
}

class _PelacakanDokumenDetailScreenState extends State<PelacakanDokumenDetailScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  bool _isLoading = true;
  String? _errorMsg;
  Map<String, dynamic>? _tx;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final res = await _spopService.getDetailTransaksi(widget.idTransaksi);
      setState(() {
        _tx = res;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        if (e is DioException) {
          _errorMsg = e.response?.data?['message'] ?? e.message;
        } else {
          _errorMsg = e.toString();
        }
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(String? status) {
    if (status == 'DISETUJUI') return Colors.green;
    if (status == 'DITOLAK') return Colors.red;
    if (status == 'PERLU_PERBAIKAN') return Colors.orange;
    if (status == 'DRAFT') return Colors.blue;
    return Colors.orange;
  }

  String _getStatusLabel(String? status) {
    if (status == 'DISETUJUI') return 'Disetujui';
    if (status == 'DITOLAK') return 'Ditolak';
    if (status == 'PERLU_PERBAIKAN') return 'Perbaikan';
    if (status == 'SEDANG_DITINJAU') return 'Ditinjau';
    if (status == 'DRAFT') return 'Draft';
    return 'Menunggu';
  }

  String _fmtDateLong(String? iso) {
    if (iso == null) return '-';
    try {
      return DateFormat('dd MMMM yyyy', 'id').format(DateTime.parse(iso).toLocal());
    } catch (_) {
      return iso;
    }
  }

  String _fmtDateTime(String? iso) {
    if (iso == null) return '-';
    try {
      return DateFormat('dd MMM yyyy, HH:mm', 'id').format(DateTime.parse(iso).toLocal()) + ' WIB';
    } catch (_) {
      return iso;
    }
  }

  Widget _buildStatusBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        text,
        style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, Color color, String title) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 18, color: color),
        ),
        const SizedBox(width: 12),
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black87)),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBadge = false, Color? badgeColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(label, style: TextStyle(color: Colors.grey.shade600, fontSize: 13, fontWeight: FontWeight.w500)),
          ),
          Expanded(
            child: isBadge 
                ? Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: (badgeColor ?? Colors.blue).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(value, style: TextStyle(color: badgeColor ?? Colors.blue, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  )
                : Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87, height: 1.4)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (_errorMsg != null) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(backgroundColor: Colors.white, elevation: 0, iconTheme: const IconThemeData(color: Colors.black)),
        body: Center(child: Text('Error: $_errorMsg')),
      );
    }

    final d = _tx!;
    final statusColor = _getStatusColor(d['status_ajuan']);
    final statusLabel = _getStatusLabel(d['status_ajuan']);
    
    // Extrak data bersarang (sama seperti monitoring_pajak_tab.dart)
    String nop = 'Menunggu NOP';
    String alamat = '-';
    String wilayah = '-';
    String luasTanah = '0';
    String luasBangunan = '0';

    String idTransaksi = d['id_transaksi']?.toString() ?? '-';
    String namaPemohon = d['nama_pengaju'] ?? d['pengaju']?['nama_lengkap'] ?? '-';
    String noHpPemohon = d['pengaju']?['no_hp_pengaju'] ?? '-';
    String alamatPemohon = d['pengaju']?['alamat_pengaju'] ?? '-';
    bool isKuasa = d['menggunakan_kuasa'] == true || d['menggunakan_kuasa'] == 'true' || d['menggunakan_kuasa'] == 1;

    if (d['jenis_transaksi'] == 'HAPUS') {
      final asalList = d['detail_asal'] as List?;
      if (asalList != null && asalList.isNotEmpty) {
        final asal = asalList[0];
        nop = asal['nop_asal']?.toString() ?? 'Menunggu NOP';
        final objekAsal = asal['objek_asal'];
        if (objekAsal != null) {
          alamat = '${objekAsal['jalan_op'] ?? ''} RT ${objekAsal['rt_op'] ?? '000'}/RW ${objekAsal['rw_op'] ?? '000'}';
          wilayah = 'KEL. ${objekAsal['kelurahan_op'] ?? '-'}, KEC. ${objekAsal['kecamatan_op'] ?? '-'}';
          luasTanah = (objekAsal['luas_tanah'] ?? 0).toString();
          luasBangunan = (objekAsal['luas_bangunan'] ?? 0).toString();
        }
      }
    } else {
      final tujuanList = d['detail_tujuan'] as List?;
      if (tujuanList != null && tujuanList.isNotEmpty) {
        final tujuan = tujuanList[0];
        nop = tujuan['nop_generated']?.toString() ?? tujuan['no_persil_baru']?.toString() ?? 'Menunggu NOP';
        alamat = '${tujuan['jalan_op_baru'] ?? ''} RT ${tujuan['rt_op_baru'] ?? '000'}/RW ${tujuan['rw_op_baru'] ?? '000'}';
        wilayah = 'KEL. ${tujuan['kelurahan_op_baru'] ?? '-'}, KEC. ${tujuan['kecamatan_op_baru'] ?? '-'}';
        luasTanah = (tujuan['luas_tanah_baru'] ?? 0).toString();
        luasBangunan = (tujuan['luas_bangunan_baru'] ?? 0).toString();
        
        if (namaPemohon == '-') {
           namaPemohon = tujuan['calon_subjek_json']?['nama_subjek'] ?? '-';
           noHpPemohon = tujuan['calon_subjek_json']?['no_hp'] ?? noHpPemohon;
           alamatPemohon = tujuan['calon_subjek_json']?['alamat_jalan'] ?? alamatPemohon;
        }
      }
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F2C59),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text('Pelacakan Dokumen', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: _buildStatusBadge(statusLabel, statusColor),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Detail Pelayanan
            _buildSectionHeader(Icons.description, Colors.blue, 'Detail Pelayanan'),
            const SizedBox(height: 16),
            _buildInfoRow('Tgl Permohonan', _fmtDateLong(d['created_at'])),
            _buildInfoRow('No. Pelayanan', idTransaksi),
            _buildInfoRow('Jenis Pajak', 'PBB-P2'),
            _buildInfoRow('Jenis Pelayanan', d['jenis_transaksi'] ?? 'BARU', isBadge: true),
            _buildInfoRow('NOP', nop),
            
            const Padding(padding: EdgeInsets.symmetric(vertical: 24), child: Divider(height: 1, thickness: 1, color: Color(0xFFEEEEEE))),
            
            // Detail Pemohon
            _buildSectionHeader(Icons.person, Colors.orange, 'Detail Pemohon'),
            const SizedBox(height: 16),
            _buildInfoRow('Nama Pemohon', namaPemohon),
            _buildInfoRow('No. Telepon', noHpPemohon),
            _buildInfoRow('Alamat', alamatPemohon),
            _buildInfoRow('Bertindak Selaku', isKuasa ? 'Kuasa' : 'Wajib Pajak (Pemilik)'),
            
            const Padding(padding: EdgeInsets.symmetric(vertical: 24), child: Divider(height: 1, thickness: 1, color: Color(0xFFEEEEEE))),

            // Detail Objek Pajak
            _buildSectionHeader(Icons.landscape, Colors.green, 'Detail Objek Pajak'),
            const SizedBox(height: 16),
            _buildInfoRow('Letak Objek', '$alamat\n$wilayah'),
            _buildInfoRow('Luas Tanah', '$luasTanah m²'),
            _buildInfoRow('Luas Bangunan', '$luasBangunan m²'),
            
            const Padding(padding: EdgeInsets.symmetric(vertical: 24), child: Divider(height: 1, thickness: 1, color: Color(0xFFEEEEEE))),
            
            // Dokumen Persyaratan
            _buildSectionHeader(Icons.folder_open, Colors.purple, 'Dokumen Persyaratan'),
            const SizedBox(height: 16),
            _buildLampiranList(() {
              final val = d['lampiran'];
              if (val == null) return [];
              if (val is List) return val;
              if (val is Map) {
                 List res = [];
                 void addDocs(String key, String title) {
                   if (val[key] is List) {
                     for (var url in val[key]) res.add({'jenis_dokumen': title, 'url_file': url});
                   }
                 }
                 addDocs('url_ktp', 'KTP');
                 addDocs('url_sertifikat', 'Sertifikat Hak Milik');
                 addDocs('url_ajb', 'Akte Jual Beli');
                 addDocs('url_imb', 'Izin Mendirikan Bangunan');
                 addDocs('url_surat_kuasa', 'Surat Kuasa');
                 addDocs('url_pendukung_lokasi', 'Pendukung Lokasi');
                 return res;
              }
              return [];
            }()),
            
            const Padding(padding: EdgeInsets.symmetric(vertical: 24), child: Divider(height: 1, thickness: 1, color: Color(0xFFEEEEEE))),
            
            // Riwayat Pelacakan
            _buildSectionHeader(Icons.history, Colors.black87, 'Riwayat Pelacakan'),
            const SizedBox(height: 24),
            _buildTimeline(d['riwayat'] as List? ?? []),
          ],
        ),
      ),
    );
  }

  Widget _buildLampiranList(List lampiran) {
    if (lampiran.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Text('Tidak ada lampiran dokumen.', style: TextStyle(color: Colors.grey.shade500, fontStyle: FontStyle.italic)),
      );
    }
    return Column(
      children: List.generate(lampiran.length, (index) {
        final l = lampiran[index];
        final rawJenis = l['jenis_dokumen']?.toString() ?? 'DOKUMEN';
        final jenis = rawJenis.replaceAll('_', ' ').toLowerCase();
        final title = jenis.split(' ').map((str) => str.isNotEmpty ? '${str[0].toUpperCase()}${str.substring(1)}' : '').join(' ');

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(8),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading: const Icon(Icons.description, color: Colors.purple, size: 28),
            title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            trailing: InkWell(
              onTap: () async {
                final url = l['url_file']?.toString();
                if (url != null && url.isNotEmpty) {
                  final uri = Uri.parse(url);
                  if (await canLaunchUrl(uri)) {
                    await launchUrl(uri, mode: LaunchMode.externalApplication);
                  }
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.purple.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.download, size: 14, color: Colors.purple),
                    SizedBox(width: 4),
                    Text('Unduh', style: TextStyle(color: Colors.purple, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildTimeline(List riwayat) {
    if (riwayat.isEmpty) {
      return Text('Belum ada riwayat', style: TextStyle(color: Colors.grey.shade500));
    }
    return Column(
      children: List.generate(riwayat.length, (index) {
        final r = riwayat[index];
        final isLast = index == riwayat.length - 1;
        
        IconData iconData = Icons.send;
        Color iconBg = const Color(0xFFE3F2FD);
        Color iconColor = const Color(0xFF1565C0);
        
        final statusBaru = r['status_baru'] ?? r['status_riwayat'] ?? '';
        final waktuKejadian = r['created_at'] ?? r['waktu_kejadian'];
        final keterangan = r['catatan'] ?? r['keterangan'];

        final desc = statusBaru.toString().toLowerCase();
        if (desc.contains('reviu') || desc.contains('persetujuan') || desc.contains('proses')) {
          iconData = Icons.refresh;
          iconBg = const Color(0xFFFFF8E1);
          iconColor = const Color(0xFFF57F17);
        } else if (desc.contains('setuju') || desc.contains('selesai')) {
          iconData = Icons.check;
          iconBg = const Color(0xFFE8F5E9);
          iconColor = const Color(0xFF2E7D32);
        } else if (desc.contains('tolak') || desc.contains('perbaikan') || desc.contains('revisi')) {
          iconData = Icons.close;
          iconBg = const Color(0xFFFFEBEE);
          iconColor = const Color(0xFFC62828);
        }

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
                  child: Icon(iconData, size: 16, color: iconColor),
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: keterangan != null ? 60 : 40,
                    color: Colors.grey.shade200,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                  ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    statusBaru,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    _fmtDateTime(waktuKejadian),
                    style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                  ),
                  if (keterangan != null) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Text(
                        keterangan.toString(),
                        style: TextStyle(color: Colors.grey.shade700, fontSize: 12),
                      ),
                    ),
                  ],
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        );
      }),
    );
  }
}
