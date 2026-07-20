import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';

class DetailReviewSpopScreen extends StatefulWidget {
  final String idTransaksi;

  const DetailReviewSpopScreen({super.key, required this.idTransaksi});

  @override
  State<DetailReviewSpopScreen> createState() => _DetailReviewSpopScreenState();
}

class _DetailReviewSpopScreenState extends State<DetailReviewSpopScreen> {
  final _spopService = TransaksiSpopService(ApiService());

  Map<String, dynamic>? _transaksi;
  bool _isLoading = true;
  bool _isProcessing = false;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    setState(() { _isLoading = true; _errorMsg = null; });
    try {
      final data = await _spopService.getDetailTransaksi(widget.idTransaksi);
      setState(() { _transaksi = data; });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat detail'; });
    } catch (e) {
      setState(() { _errorMsg = 'Error: $e'; });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  Future<void> _tampilkanDialogPenolakan() async {
    final catatanController = TextEditingController();
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Tolak Pengajuan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Berikan alasan penolakan agar Perangkat Desa dapat memperbaikinya:'),
            const SizedBox(height: 12),
            TextField(
              controller: catatanController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Misal: Bukti kepemilikan tidak sesuai...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
              foregroundColor: Theme.of(context).colorScheme.onError,
            ),
            child: const Text('Kirim Penolakan'),
          ),
        ],
      ),
    );

    if (result == true && mounted) {
      await _prosesVerifikasi(disetujui: false, catatan: catatanController.text);
    }
  }

  Future<void> _prosesSetujui() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Konfirmasi Persetujuan'),
        content: const Text('Anda yakin menyetujui pengajuan ini? Data akan diproses dan NOP akan diterbitkan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Ya, Setujui')),
        ],
      ),
    );
    if (ok == true && mounted) {
      await _prosesVerifikasi(disetujui: true);
    }
  }

  Future<void> _prosesVerifikasi({required bool disetujui, String? catatan}) async {
    setState(() => _isProcessing = true);
    try {
      await _spopService.verifikasiSpop(
        widget.idTransaksi,
        disetujui: disetujui,
        catatan: catatan,
      );
      if (mounted) Navigator.pop(context, disetujui);
    } on DioException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.response?.data?['message'] ?? 'Gagal memproses verifikasi'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Widget _buildSectionInfo(String title, Map<String, String> items) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: theme.colorScheme.outline.withValues(alpha: 0.2)),
          ),
          child: Column(
            children: items.entries.map((e) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 2, child: Text(e.key, style: TextStyle(color: theme.colorScheme.onSurfaceVariant))),
                  const Text(' : '),
                  Expanded(flex: 3, child: Text(e.value, style: const TextStyle(fontWeight: FontWeight.bold))),
                ],
              ),
            )).toList(),
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  String _fmt(dynamic v) => v?.toString() ?? '-';
  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd MMM yyyy, HH:mm', 'id').format(DateTime.parse(iso)); } catch(_) { return iso; }
  }
  String _labelJenis(String? j) {
    const m = {'BARU': 'Pendaftaran Baru', 'MUTASI': 'Mutasi', 'PERUBAHAN_DATA': 'Perubahan Data', 'HAPUS': 'Penghapusan'};
    return m[j] ?? j ?? '-';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tx = _transaksi;
    final bool canVerify = tx != null && (tx['status_ajuan'] == 'MENUNGGU' || tx['status_ajuan'] == 'SEDANG_DITINJAU');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Review SPOP'),
        backgroundColor: theme.colorScheme.surface,
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
                      Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
                      const SizedBox(height: 8),
                      Text(_errorMsg!, style: TextStyle(color: theme.colorScheme.error)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(onPressed: _loadDetail, icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status header
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.secondaryContainer,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.assignment_ind_outlined, color: theme.colorScheme.onSecondaryContainer, size: 32),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('${_labelJenis(tx?['jenis_transaksi'])}',
                                      style: const TextStyle(fontWeight: FontWeight.bold)),
                                  Text('Diajukan: ${_fmtDate(tx?['created_at'])}',
                                      style: theme.textTheme.bodySmall),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Data Pengaju
                      _buildSectionInfo('1. Data Pengajuan', {
                        'Jenis Layanan': _labelJenis(tx?['jenis_transaksi']),
                        'NOP Utama': _fmt(tx?['nop_bersama']),
                        'No. SPPT Lama': _fmt(tx?['no_sppt_lama']),
                        'Status': _fmt(tx?['status_ajuan']),
                        'Tahun Pajak': _fmt(tx?['tahun_pajak']),
                      }),

                      // Data Subjek (jika ada)
                      if (tx?['detail_tujuan'] != null && (tx!['detail_tujuan'] as List).isNotEmpty)
                        _buildSectionInfo('2. Data Wajib Pajak (Tujuan)', {
                          'Nama WP': _fmt(tx['detail_tujuan'][0]['calon_subjek_json']?['nama']),
                          'NIK': _fmt(tx['detail_tujuan'][0]['nik_calon_subjek']),
                          'Alamat': _fmt(tx['detail_tujuan'][0]['calon_subjek_json']?['alamat']),
                        }),

                      // Riwayat
                      if (tx?['riwayat_pelacakan'] != null && (tx!['riwayat_pelacakan'] as List).isNotEmpty)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('3. Riwayat Proses', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                            const SizedBox(height: 12),
                            ...((tx['riwayat_pelacakan'] as List).map((r) => ListTile(
                              dense: true,
                              leading: const Icon(Icons.circle, size: 10),
                              title: Text(_fmt(r['keterangan'])),
                              subtitle: Text(_fmtDate(r['created_at'])),
                            ))),
                          ],
                        ),

                      const SizedBox(height: 80),
                    ],
                  ),
                ),
      bottomNavigationBar: canVerify
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _isProcessing ? null : _tampilkanDialogPenolakan,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: theme.colorScheme.error,
                          side: BorderSide(color: theme.colorScheme.error),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: _isProcessing ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Tolak'),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _isProcessing ? null : _prosesSetujui,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: theme.colorScheme.onPrimary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: _isProcessing ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Text('Setujui'),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
