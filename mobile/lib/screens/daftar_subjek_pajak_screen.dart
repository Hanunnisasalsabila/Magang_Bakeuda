import 'dart:async';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/subjek_pajak_service.dart';
import 'detail_subjek_pajak_screen.dart';

class DaftarSubjekPajakScreen extends StatefulWidget {
  const DaftarSubjekPajakScreen({super.key});

  @override
  State<DaftarSubjekPajakScreen> createState() => _DaftarSubjekPajakScreenState();
}

class _DaftarSubjekPajakScreenState extends State<DaftarSubjekPajakScreen> {
  final _service = SubjekPajakService(ApiService());
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _debounce;

  List<Map<String, dynamic>> _data = [];
  bool _isLoading = true;
  String? _errorMsg;
  int _page = 1;
  int _total = 0;
  bool _hasMore = true;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _loadData(reset: true);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _debounce?.cancel();
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
      setState(() {
        _isLoading = true;
        _errorMsg = null;
        _page = 1;
        _hasMore = true;
      });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      final result = await _service.getDaftar(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        page: _page,
        limit: 25,
      );

      final newItems = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final total = result['total'] as int? ?? 0;

      setState(() {
        _total = total;
        if (reset) {
          _data = newItems;
        } else {
          _data.addAll(newItems);
        }
        _page++;
        _hasMore = _data.length < total;
      });
    } on DioException catch (e) {
      setState(() {
        _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data';
      });
    } catch (e) {
      setState(() {
        _errorMsg = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
        _isLoadingMore = false;
      });
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toUpperCase()) {
      case 'PEMILIK':
        return Colors.green;
      case 'PENYEWA':
        return Colors.purple;
      case 'PENGELOLA':
        return Colors.amber.shade700;
      case 'PEMAKAI':
        return Colors.cyan.shade700;
      case 'SENGKETA':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Daftar Subjek Pajak'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(68),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari NIK, nama, atau alamat...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _loadData(reset: true);
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onChanged: (val) {
                if (_debounce?.isActive ?? false) _debounce!.cancel();
                _debounce = Timer(const Duration(milliseconds: 500), () {
                  _loadData(reset: true);
                });
              },
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
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(_errorMsg!, textAlign: TextAlign.center),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () => _loadData(reset: true),
                        icon: const Icon(Icons.refresh),
                        label: const Text('Coba Lagi'),
                      ),
                    ],
                  ),
                )
              : _data.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.person_search, size: 64, color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.4)),
                          const SizedBox(height: 16),
                          Text(
                            'Tidak ada subjek pajak ditemukan',
                            style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontWeight: FontWeight.w500),
                          ),
                          if (_searchController.text.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(
                              'Coba ubah kata kunci pencarian',
                              style: TextStyle(color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.7), fontSize: 13),
                            ),
                          ],
                        ],
                      ),
                    )
                  : Column(
                      children: [
                        // Total counter
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.3),
                          child: Text(
                            'Total $_total subjek pajak',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                        Expanded(
                          child: RefreshIndicator(
                            onRefresh: () => _loadData(reset: true),
                            child: ListView.builder(
                              controller: _scrollController,
                              padding: const EdgeInsets.all(16),
                              itemCount: _data.length + (_hasMore ? 1 : 0),
                              itemBuilder: (context, index) {
                                if (index >= _data.length) {
                                  return const Center(
                                    child: Padding(
                                      padding: EdgeInsets.all(16),
                                      child: CircularProgressIndicator(),
                                    ),
                                  );
                                }
                                return _buildSubjekCard(_data[index], theme);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
    );
  }

  Widget _buildSubjekCard(Map<String, dynamic> item, ThemeData theme) {
    final nama = item['nama_subjek']?.toString() ?? 'Tanpa Nama';
    final nik = item['nik']?.toString() ?? '-';
    final statusWp = item['status_wp']?.toString() ?? '-';
    final alamat = item['alamat_jalan']?.toString() ?? '-';
    final rt = item['rt']?.toString() ?? '';
    final rw = item['rw']?.toString() ?? '';
    final pekerjaan = item['pekerjaan']?.toString() ?? '';
    final noHp = item['no_hp']?.toString() ?? '';
    final statusColor = _getStatusColor(statusWp);

    final isNikValid = nik.isNotEmpty && nik.trim() != '.' && nik.trim() != '-';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 0,
      color: theme.colorScheme.surface,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: isNikValid
            ? () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DetailSubjekPajakScreen(nik: nik),
                  ),
                );
              }
            : () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('NIK tidak valid, detail tidak dapat ditampilkan.'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Name + Status WP
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.person, size: 20, color: theme.colorScheme.primary),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          nama,
                          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'NIK: $nik',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                            fontFamily: 'monospace',
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      statusWp.toUpperCase(),
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Address
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.location_on_outlined, size: 14, color: theme.colorScheme.onSurfaceVariant),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      '$alamat${(rt.isNotEmpty || rw.isNotEmpty) ? ' RT $rt/RW $rw' : ''}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              // Additional info chips
              if (pekerjaan.isNotEmpty || noHp.isNotEmpty) ...[
                const SizedBox(height: 8),
                Wrap(
                  spacing: 12,
                  runSpacing: 4,
                  children: [
                    if (pekerjaan.isNotEmpty)
                      _buildInfoChip(Icons.work_outline, pekerjaan, theme),
                    if (noHp.isNotEmpty)
                      _buildInfoChip(Icons.phone_outlined, noHp, theme),
                  ],
                ),
              ],
              // Arrow indicator
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Lihat Detail',
                      style: TextStyle(
                        color: isNikValid ? theme.colorScheme.primary : Colors.grey,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward_ios,
                      size: 12,
                      color: isNikValid ? theme.colorScheme.primary : Colors.grey,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text, ThemeData theme) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: theme.colorScheme.onSurfaceVariant),
        const SizedBox(width: 4),
        Text(
          text,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}
