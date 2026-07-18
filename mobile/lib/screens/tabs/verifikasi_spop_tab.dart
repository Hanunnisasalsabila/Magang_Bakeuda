import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../services/api_service.dart';
import '../../services/transaksi_spop_service.dart';
import '../detail_review_spop_screen.dart';
import 'package:intl/intl.dart';

class VerifikasiSpopTab extends StatefulWidget {
  const VerifikasiSpopTab({super.key});

  @override
  State<VerifikasiSpopTab> createState() => _VerifikasiSpopTabState();
}

class _VerifikasiSpopTabState extends State<VerifikasiSpopTab> {
  final _spopService = TransaksiSpopService(ApiService());

  List<Map<String, dynamic>> _antrean = [];
  bool _isLoading = true;
  String? _errorMsg;
  String _filterStatus = 'MENUNGGU';

  final _statusFilter = ['MENUNGGU', 'SEDANG_DITINJAU', 'DISETUJUI', 'DITOLAK'];
  final _labelStatus = {
    'MENUNGGU': 'Menunggu',
    'SEDANG_DITINJAU': 'Sedang Ditinjau',
    'DISETUJUI': 'Disetujui',
    'DITOLAK': 'Ditolak',
  };

  @override
  void initState() {
    super.initState();
    _loadAntrean();
  }

  Future<void> _loadAntrean() async {
    setState(() { _isLoading = true; _errorMsg = null; });
    try {
      final data = await _spopService.getAntreanVerifikasi(status: _filterStatus);
      setState(() { _antrean = data; });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; });
    } catch (e) {
      setState(() { _errorMsg = 'Terjadi kesalahan: $e'; });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  Color _getStatusColor(String status, ColorScheme cs) {
    switch (status) {
      case 'DISETUJUI': return Colors.green;
      case 'DITOLAK': return cs.error;
      case 'SEDANG_DITINJAU': return Colors.orange;
      default: return Colors.blue;
    }
  }

  String _formatTanggal(String? iso) {
    if (iso == null) return '-';
    try {
      return DateFormat('dd MMM yyyy', 'id').format(DateTime.parse(iso));
    } catch (_) {
      return iso;
    }
  }

  String _labelJenis(String? jenis) {
    const map = {
      'BARU': 'Pendaftaran Baru',
      'MUTASI': 'Mutasi',
      'PERUBAHAN_DATA': 'Perubahan Data',
      'HAPUS': 'Penghapusan',
    };
    return map[jenis] ?? jenis ?? '-';
  }

  Future<void> _navigateToDetail(Map<String, dynamic> item) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DetailReviewSpopScreen(idTransaksi: item['id_transaksi']),
      ),
    );

    if (result != null && mounted) {
      final snack = result == true ? '✅ Pengajuan berhasil disetujui!' : '❌ Pengajuan ditolak.';
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(snack)));
      _loadAntrean(); // refresh list
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Antrean Verifikasi SPOP', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              // Filter chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _statusFilter.map((s) {
                    final isSelected = _filterStatus == s;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(_labelStatus[s] ?? s),
                        selected: isSelected,
                        onSelected: (sel) {
                          if (sel) {
                            setState(() => _filterStatus = s);
                            _loadAntrean();
                          }
                        },
                        selectedColor: theme.colorScheme.primary,
                        labelStyle: TextStyle(
                          color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.onSurfaceVariant,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          fontSize: 12,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // Body
        Expanded(
          child: _isLoading
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
                          ElevatedButton.icon(onPressed: _loadAntrean, icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                        ],
                      ),
                    )
                  : _antrean.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.check_circle_outline, size: 64, color: theme.colorScheme.primary),
                              const SizedBox(height: 16),
                              Text(
                                _filterStatus == 'MENUNGGU'
                                    ? 'Semua pengajuan sudah diverifikasi!'
                                    : 'Tidak ada data untuk filter ini.',
                                style: TextStyle(color: theme.colorScheme.onSurfaceVariant),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: _loadAntrean,
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _antrean.length,
                            itemBuilder: (context, index) {
                              final item = _antrean[index];
                              final status = item['status_ajuan'] ?? 'MENUNGGU';
                              final statusColor = _getStatusColor(status, theme.colorScheme);
                              final desa = item['pengaju']?['kode_wilayah'] ?? '-';

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                elevation: 0,
                                color: theme.colorScheme.surface,
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            item['id_transaksi']?.toString().substring(0, 8).toUpperCase() ?? '-',
                                            style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: statusColor.withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              _labelStatus[status] ?? status,
                                              style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        _labelJenis(item['jenis_transaksi']),
                                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Desa: $desa • ${_formatTanggal(item['created_at'])}',
                                        style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.end,
                                        children: [
                                          OutlinedButton(
                                            onPressed: () => _navigateToDetail(item),
                                            child: const Text('Detail'),
                                          ),
                                          if (status == 'MENUNGGU' || status == 'SEDANG_DITINJAU') ...[
                                            const SizedBox(width: 8),
                                            ElevatedButton(
                                              onPressed: () => _navigateToDetail(item),
                                              child: const Text('Verifikasi'),
                                            ),
                                          ],
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
        ),
      ],
    );
  }
}
