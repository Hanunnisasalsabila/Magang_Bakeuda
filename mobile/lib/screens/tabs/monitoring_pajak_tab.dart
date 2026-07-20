import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../../services/api_service.dart';
import '../../services/transaksi_spop_service.dart';
import '../../services/export_service.dart';

class MonitoringPajakTab extends StatefulWidget {
  const MonitoringPajakTab({super.key});

  @override
  State<MonitoringPajakTab> createState() => _MonitoringPajakTabState();
}

class _MonitoringPajakTabState extends State<MonitoringPajakTab> {
  final _spopService = TransaksiSpopService(ApiService());
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _data = [];
  bool _isLoading = true;
  bool _isExporting = false;
  String? _errorMsg;
  String _selectedFilter = 'Semua';
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;
  final ScrollController _scrollController = ScrollController();

  final List<String> _filters = ['Semua', 'Aktif', 'Menunggu Verifikasi', 'Ditolak'];
  final Map<String, bool?> _filterStatusAktif = {
    'Semua': null,
    'Aktif': true,
    'Menunggu Verifikasi': null,
    'Ditolak': null,
  };
  final Map<String, String?> _filterStatusAjuan = {
    'Semua': null,
    'Aktif': null,
    'Menunggu Verifikasi': 'MENUNGGU',
    'Ditolak': 'DITOLAK',
  };

  @override
  void initState() {
    super.initState();
    _loadData(reset: true);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoadingMore && _hasMore) {
        _loadData(reset: false);
      }
    }
  }

  Future<void> _loadData({bool reset = true}) async {
    if (reset) {
      setState(() { _isLoading = true; _errorMsg = null; _page = 1; _hasMore = true; });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      final result = await _spopService.getMonitoringObjekPajak(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        statusAktif: _filterStatusAktif[_selectedFilter],
        statusAjuan: _filterStatusAjuan[_selectedFilter],
        page: _page,
        limit: 20,
      );

      final newItems = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final total = result['total'] as int? ?? 0;

      setState(() {
        if (reset) {
          _data = newItems;
        } else {
          _data.addAll(newItems);
        }
        _page++;
        _hasMore = _data.length < total;
      });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; });
    } catch (e) {
      setState(() { _errorMsg = 'Error: $e'; });
    } finally {
      setState(() { _isLoading = false; _isLoadingMore = false; });
    }
  }

  Future<void> _exportPdf() async {
    setState(() => _isExporting = true);
    try {
      // Load all data for export
      final result = await _spopService.getMonitoringObjekPajak(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        statusAktif: _filterStatusAktif[_selectedFilter],
        statusAjuan: _filterStatusAjuan[_selectedFilter],
        page: 1,
        limit: 1000,
      );
      final allData = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final file = await ExportService.exportObjekPajakPdf(allData);
      if (mounted) {
        final result2 = await showModalBottomSheet<String>(
          context: context,
          builder: (ctx) => SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(leading: const Icon(Icons.open_in_new), title: const Text('Buka File'), onTap: () => Navigator.pop(ctx, 'open')),
                ListTile(leading: const Icon(Icons.share), title: const Text('Bagikan (WhatsApp, dll)'), onTap: () => Navigator.pop(ctx, 'share')),
              ],
            ),
          ),
        );
        if (result2 == 'open') await ExportService.openFile(file);
        if (result2 == 'share') await ExportService.shareFile(file, subject: 'Daftar Objek Pajak – SIPD Purbalingga');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal ekspor PDF: $e')));
      }
    } finally {
      setState(() => _isExporting = false);
    }
  }

  Future<void> _exportExcel() async {
    setState(() => _isExporting = true);
    try {
      final result = await _spopService.getMonitoringObjekPajak(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        statusAktif: _filterStatusAktif[_selectedFilter],
        statusAjuan: _filterStatusAjuan[_selectedFilter],
        page: 1, limit: 1000,
      );
      final allData = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final file = await ExportService.exportObjekPajakExcel(allData);
      if (mounted) {
        final r = await showModalBottomSheet<String>(
          context: context,
          builder: (ctx) => SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(leading: const Icon(Icons.open_in_new), title: const Text('Buka File'), onTap: () => Navigator.pop(ctx, 'open')),
                ListTile(leading: const Icon(Icons.share), title: const Text('Bagikan (WhatsApp, dll)'), onTap: () => Navigator.pop(ctx, 'share')),
              ],
            ),
          ),
        );
        if (r == 'open') await ExportService.openFile(file);
        if (r == 'share') await ExportService.shareFile(file, subject: 'Daftar Objek Pajak – SIPD Purbalingga');
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal ekspor Excel: $e')));
    } finally {
      setState(() => _isExporting = false);
    }
  }

  Color _getStatusColor(Map<String, dynamic> d, ColorScheme cs) {
    if (d['status_aktif'] == false) return cs.error;
    final sa = d['status_ajuan'] as String?;
    if (sa == 'MENUNGGU' || sa == 'SEDANG_DITINJAU') return Colors.orange;
    if (sa == 'DITOLAK') return cs.error;
    return Colors.green;
  }

  String _getStatusLabel(Map<String, dynamic> d) {
    if (d['status_aktif'] == false) return 'Tidak Aktif';
    final sa = d['status_ajuan'] as String?;
    if (sa == 'MENUNGGU') return 'Menunggu Verifikasi';
    if (sa == 'SEDANG_DITINJAU') return 'Sedang Ditinjau';
    if (sa == 'DITOLAK') return 'Ditolak';
    return 'Aktif';
  }

  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd MMM yyyy', 'id').format(DateTime.parse(iso)); } catch(_) { return iso; }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        // Header & Search
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Monitoring Objek Pajak', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  if (_isExporting)
                    const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(strokeWidth: 2))
                  else
                    PopupMenuButton<String>(
                      icon: const Icon(Icons.download_outlined),
                      tooltip: 'Ekspor Data',
                      onSelected: (v) { if (v == 'pdf') _exportPdf(); if (v == 'excel') _exportExcel(); },
                      itemBuilder: (_) => [
                        const PopupMenuItem(value: 'pdf', child: ListTile(leading: Icon(Icons.picture_as_pdf), title: Text('Ekspor PDF'))),
                        const PopupMenuItem(value: 'excel', child: ListTile(leading: Icon(Icons.table_chart), title: Text('Ekspor Excel'))),
                      ],
                    ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Cari NOP atau Nama Wajib Pajak...',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchController.clear(); _loadData(reset: true); })
                      : null,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  filled: true,
                  fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                ),
                onSubmitted: (_) => _loadData(reset: true),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _filters.map((f) {
                    final isSelected = _selectedFilter == f;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(f),
                        selected: isSelected,
                        onSelected: (sel) {
                          if (sel) { setState(() => _selectedFilter = f); _loadData(reset: true); }
                        },
                        selectedColor: theme.colorScheme.primary,
                        labelStyle: TextStyle(
                          color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.onSurfaceVariant,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),

        // List
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
                          ElevatedButton.icon(onPressed: () => _loadData(reset: true), icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                        ],
                      ),
                    )
                  : _data.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.inbox_outlined, size: 64, color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5)),
                              const SizedBox(height: 16),
                              Text('Tidak ada data ditemukan', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => _loadData(reset: true),
                          child: ListView.builder(
                            controller: _scrollController,
                            padding: const EdgeInsets.all(16),
                            itemCount: _data.length + (_hasMore ? 1 : 0),
                            itemBuilder: (context, index) {
                              if (index >= _data.length) {
                                return const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()));
                              }

                              final d = _data[index];
                              final statusColor = _getStatusColor(d, theme.colorScheme);
                              final nama = d['subjek_pajak']?['nama_subjek'] ?? '-';

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
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: statusColor.withValues(alpha: 0.1),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(_getStatusLabel(d), style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold)),
                                          ),
                                          Text(_fmtDate(d['updated_at']), style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      Text(d['nop'] ?? '-', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                                      const SizedBox(height: 4),
                                      Text(nama, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600)),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(Icons.location_on_outlined, size: 14, color: theme.colorScheme.onSurfaceVariant),
                                          const SizedBox(width: 4),
                                          Expanded(child: Text(d['jalan_op'] ?? '-', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant))),
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
