import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/objek_pajak_service.dart';
import '../services/export_service.dart';
import 'package:intl/intl.dart';

class DaftarObjekPajakScreen extends StatefulWidget {
  const DaftarObjekPajakScreen({super.key});

  @override
  State<DaftarObjekPajakScreen> createState() => _DaftarObjekPajakScreenState();
}

class _DaftarObjekPajakScreenState extends State<DaftarObjekPajakScreen> {
  final _service = ObjekPajakService(ApiService());
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();

  List<Map<String, dynamic>> _data = [];
  bool _isLoading = true;
  bool _isExporting = false;
  String? _errorMsg;
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;

  String? _filterKecamatan;
  bool? _filterStatusAktif;
  List<String> _kecamatanList = [];

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
      if (!_isLoadingMore && _hasMore) _loadData(reset: false);
    }
  }

  Future<void> _loadData({bool reset = true}) async {
    if (reset) {
      setState(() { _isLoading = true; _errorMsg = null; _page = 1; _hasMore = true; });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      final result = await _service.getDaftar(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        statusAktif: _filterStatusAktif,
        page: _page,
        limit: 25,
      );

      final newItems = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final total = result['total'] as int? ?? 0;

      // Kumpulkan kecamatan unik untuk filter dropdown
      if (reset) {
        final kecSet = <String>{};
        for (final d in newItems) {
          final kec = d['wilayah']?['kecamatan']?.toString();
          if (kec != null) kecSet.add(kec);
        }
        _kecamatanList = kecSet.toList()..sort();
      }

      setState(() {
        if (reset) _data = newItems; else _data.addAll(newItems);
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

  Future<void> _exportData(String format) async {
    setState(() => _isExporting = true);
    try {
      final result = await _service.getDaftar(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        statusAktif: _filterStatusAktif,
        page: 1,
        limit: 2000,
      );
      final allData = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();

      late final file;
      if (format == 'pdf') {
        file = await ExportService.exportObjekPajakPdf(allData);
      } else {
        file = await ExportService.exportObjekPajakExcel(allData);
      }

      if (mounted) {
        final r = await showModalBottomSheet<String>(
          context: context,
          builder: (ctx) => SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(leading: const Icon(Icons.open_in_new), title: const Text('Buka File'), onTap: () => Navigator.pop(ctx, 'open')),
                ListTile(leading: const Icon(Icons.share), title: const Text('Bagikan'), onTap: () => Navigator.pop(ctx, 'share')),
              ],
            ),
          ),
        );
        if (r == 'open') await ExportService.openFile(file);
        if (r == 'share') await ExportService.shareFile(file, subject: 'Daftar Objek Pajak – SIPD Purbalingga');
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal ekspor: $e')));
    } finally {
      setState(() => _isExporting = false);
    }
  }

  void _showFilterBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModal) {
            return Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Filter Data', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 20),
                  Text('Status Aktif', style: Theme.of(context).textTheme.labelLarge),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      ChoiceChip(label: const Text('Semua'), selected: _filterStatusAktif == null, onSelected: (v) => setModal(() => _filterStatusAktif = null)),
                      ChoiceChip(label: const Text('Aktif'), selected: _filterStatusAktif == true, onSelected: (v) => setModal(() => _filterStatusAktif = true)),
                      ChoiceChip(label: const Text('Tidak Aktif'), selected: _filterStatusAktif == false, onSelected: (v) => setModal(() => _filterStatusAktif = false)),
                    ],
                  ),
                  if (_kecamatanList.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text('Kecamatan', style: Theme.of(context).textTheme.labelLarge),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String?>(
                      value: _filterKecamatan,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      items: [
                        const DropdownMenuItem(value: null, child: Text('Semua Kecamatan')),
                        ..._kecamatanList.map((k) => DropdownMenuItem(value: k, child: Text(k))),
                      ],
                      onChanged: (v) => setModal(() => _filterKecamatan = v),
                    ),
                  ],
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setModal(() { _filterStatusAktif = null; _filterKecamatan = null; });
                          },
                          child: const Text('Reset Filter'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(ctx);
                            setState(() {});
                            _loadData(reset: true);
                          },
                          child: const Text('Terapkan'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd/MM/yyyy', 'id').format(DateTime.parse(iso)); } catch(_) { return iso; }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daftar Objek Pajak'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.filter_list), tooltip: 'Filter', onPressed: _showFilterBottomSheet),
          if (_isExporting)
            const Padding(padding: EdgeInsets.all(8), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)))
          else
            PopupMenuButton<String>(
              icon: const Icon(Icons.download_outlined),
              tooltip: 'Ekspor',
              onSelected: _exportData,
              itemBuilder: (_) => [
                const PopupMenuItem(value: 'pdf', child: ListTile(leading: Icon(Icons.picture_as_pdf), title: Text('Ekspor PDF'))),
                const PopupMenuItem(value: 'excel', child: ListTile(leading: Icon(Icons.table_chart), title: Text('Ekspor Excel'))),
              ],
            ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(68),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari NOP, nama WP, atau alamat...',
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
          ),
        ),
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
                      Text(_errorMsg!),
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
                          Text('Tidak ada objek pajak ditemukan', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
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
                          final isAktif = d['status_aktif'] == true;
                          final nama = d['subjek_pajak']?['nama_subjek']?.toString() ?? '-';
                          final nop = d['nop']?.toString() ?? '-';
                          final jalan = d['jalan_op']?.toString() ?? '-';
                          final kecamatan = d['wilayah']?['kecamatan']?.toString() ?? '';
                          final desa = d['wilayah']?['nama_desa']?.toString() ?? '';
                          final luasTanah = d['luas_tanah']?.toString() ?? '0';
                          final luasBgn = d['luas_bangunan']?.toString() ?? '0';

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
                                      Expanded(
                                        child: Text(
                                          nop,
                                          style: theme.textTheme.bodySmall?.copyWith(
                                            color: theme.colorScheme.primary,
                                            fontWeight: FontWeight.bold,
                                            fontFamily: 'monospace',
                                          ),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: (isAktif ? Colors.green : theme.colorScheme.error).withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          isAktif ? 'Aktif' : 'Tidak Aktif',
                                          style: TextStyle(
                                            color: isAktif ? Colors.green : theme.colorScheme.error,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(nama, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Icons.location_on_outlined, size: 13, color: theme.colorScheme.onSurfaceVariant),
                                      const SizedBox(width: 4),
                                      Expanded(child: Text('$jalan${desa.isNotEmpty ? ', $desa' : ''}${kecamatan.isNotEmpty ? ', Kec. $kecamatan' : ''}',
                                          style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant))),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 12,
                                    children: [
                                      _buildChipInfo('Tanah', '$luasTanah m²', Icons.landscape_outlined, theme),
                                      _buildChipInfo('Bangunan', '$luasBgn m²', Icons.home_outlined, theme),
                                      _buildChipInfo('Diperbarui', _fmtDate(d['updated_at']), Icons.calendar_today_outlined, theme),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  Widget _buildChipInfo(String label, String value, IconData icon, ThemeData theme) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: theme.colorScheme.onSurfaceVariant),
        const SizedBox(width: 3),
        Text('$label: $value', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      ],
    );
  }
}
