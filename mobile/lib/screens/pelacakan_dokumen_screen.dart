import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';
import 'detail_review_spop_screen.dart';

class PelacakanDokumenScreen extends StatefulWidget {
  const PelacakanDokumenScreen({super.key});

  @override
  State<PelacakanDokumenScreen> createState() => _PelacakanDokumenScreenState();
}

class _PelacakanDokumenScreenState extends State<PelacakanDokumenScreen> {
  final _spopService = TransaksiSpopService(ApiService());

  List<Map<String, dynamic>> _daftarTransaksi = [];
  bool _isLoading = true;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() { _isLoading = true; _errorMsg = null; });
    try {
      // Ambil transaksi milik desa yang login
      final data = await _spopService.getTransaksiSaya();
      setState(() { _daftarTransaksi = data; });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; });
    } catch (e) {
      setState(() { _errorMsg = 'Error: $e'; });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  Color _statusColor(String? status, ColorScheme cs) {
    switch (status) {
      case 'DISETUJUI': return Colors.green;
      case 'DITOLAK': return cs.error;
      case 'SEDANG_DITINJAU': return Colors.orange;
      case 'DRAFT': return Colors.grey;
      default: return Colors.blue;
    }
  }

  String _labelStatus(String? s) {
    const m = {
      'DRAFT': 'Draft',
      'MENUNGGU': 'Menunggu Verifikasi',
      'SEDANG_DITINJAU': 'Sedang Direview',
      'DISETUJUI': 'Disetujui',
      'DITOLAK': 'Ditolak',
    };
    return m[s] ?? s ?? '-';
  }

  String _labelJenis(String? j) {
    const m = {'BARU': 'Pendaftaran Baru', 'MUTASI': 'Mutasi', 'PERUBAHAN_DATA': 'Perubahan Data', 'HAPUS': 'Penghapusan'};
    return m[j] ?? j ?? '-';
  }

  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd MMM yyyy', 'id').format(DateTime.parse(iso)); } catch(_) { return iso; }
  }

  void _showTimelineDialog(Map<String, dynamic> tx) {
    final theme = Theme.of(context);
    final riwayat = (tx['riwayat_pelacakan'] as List?) ?? [];

    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Riwayat Status', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
              const SizedBox(height: 4),
              Text('Jenis: ${_labelJenis(tx['jenis_transaksi'])}'),
              const Divider(height: 24),
              riwayat.isEmpty
                  ? const Text('Belum ada riwayat proses.')
                  : ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: riwayat.length,
                      itemBuilder: (_, i) {
                        final item = riwayat[i];
                        final isLast = i == riwayat.length - 1;
                        return Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(
                              children: [
                                Container(
                                  width: 24, height: 24,
                                  decoration: BoxDecoration(shape: BoxShape.circle, color: theme.colorScheme.primary),
                                  child: const Icon(Icons.check, size: 14, color: Colors.white),
                                ),
                                if (!isLast) Container(width: 2, height: 40, color: theme.colorScheme.primary.withValues(alpha: 0.3)),
                              ],
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item['keterangan']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                                  Text(_fmtDate(item['created_at']), style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                  const SizedBox(height: 16),
                                ],
                              ),
                            ),
                          ],
                        );
                      },
                    ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Tutup')),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _navigateToDetail(Map<String, dynamic> tx) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DetailReviewSpopScreen(
          idTransaksi: tx['id_transaksi'].toString(),
          isReadOnly: true,
        ),
      ),
    ).then((value) {
      if (value == true) _loadData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pelacakan Dokumen'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadData),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMsg != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
                      const SizedBox(height: 8),
                      Text(_errorMsg!, style: TextStyle(color: theme.colorScheme.error)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(onPressed: _loadData, icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                    ],
                  ),
                )
              : _daftarTransaksi.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.folder_open, size: 64, color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5)),
                          const SizedBox(height: 16),
                          Text('Belum ada pengajuan SPOP yang dibuat.', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _daftarTransaksi.length,
                        itemBuilder: (context, index) {
                          final tx = _daftarTransaksi[index];
                          final status = tx['status_ajuan'] as String?;
                          final statusColor = _statusColor(status, theme.colorScheme);

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                            color: theme.colorScheme.surface,
                            child: InkWell(
                              onTap: () => _navigateToDetail(tx),
                              borderRadius: BorderRadius.circular(12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(_labelJenis(tx['jenis_transaksi']),
                                            style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold)),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: statusColor.withValues(alpha: 0.12),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            _labelStatus(status),
                                            style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      tx['nop_bersama'] ?? tx['id_transaksi']?.toString().substring(0, 16).toUpperCase() ?? '-',
                                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 4),
                                    Text('Diajukan: ${_fmtDate(tx['created_at'])}',
                                        style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                    if (tx['catatan_verifikator'] != null) ...[
                                      const SizedBox(height: 8),
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: theme.colorScheme.errorContainer.withValues(alpha: 0.5),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Row(
                                          children: [
                                            Icon(Icons.info_outline, size: 14, color: theme.colorScheme.onErrorContainer),
                                            const SizedBox(width: 6),
                                            Expanded(
                                              child: Text(tx['catatan_verifikator'].toString(),
                                                  style: TextStyle(fontSize: 12, color: theme.colorScheme.onErrorContainer)),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                    const SizedBox(height: 10),
                                    Row(
                                      children: [
                                        Icon(Icons.touch_app_outlined, size: 14, color: theme.colorScheme.onSurfaceVariant),
                                        const SizedBox(width: 4),
                                        Text('Ketuk untuk melihat detail', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
