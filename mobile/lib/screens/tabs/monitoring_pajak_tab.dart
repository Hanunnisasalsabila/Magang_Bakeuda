import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../pelacakan_dokumen_detail_screen.dart';
import '../spop_form_screen.dart';
import '../../services/api_service.dart';
import '../../services/transaksi_spop_service.dart';
import '../../services/dashboard_service.dart';

class MonitoringPajakTab extends StatefulWidget {
  const MonitoringPajakTab({super.key});

  @override
  State<MonitoringPajakTab> createState() => _MonitoringPajakTabState();
}

class _MonitoringPajakTabState extends State<MonitoringPajakTab> {
  final _spopService = TransaksiSpopService(ApiService());
  final _dashboardService = DashboardService();
  final _searchController = TextEditingController();

  Map<String, dynamic>? _stats;
  List<Map<String, dynamic>> _rawData = [];
  List<Map<String, dynamic>> _data = [];
  bool _isLoading = true;
  String? _errorMsg;
  String _selectedFilter = 'Semua Status';
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;
  final ScrollController _scrollController = ScrollController();

  final List<String> _filters = [
    'Semua Status',
    'Menunggu Verifikasi',
    'Diproses',
    'Disetujui',
    'Perlu Revisi',
    'Draft',
    'Ditolak'
  ];

  String _mapFilterToStatusAjuan(String f) {
    switch (f) {
      case 'Menunggu Verifikasi': return 'MENUNGGU';
      case 'Diproses': return 'SEDANG_DITINJAU';
      case 'Disetujui': return 'DISETUJUI';
      case 'Perlu Revisi': return 'PERLU_PERBAIKAN';
      case 'Draft': return 'DRAFT';
      case 'Ditolak': return 'DITOLAK';
      default: return '';
    }
  }

  @override
  void initState() {
    super.initState();
    _loadStats();
    _loadData(reset: true);
    _scrollController.addListener(_onScroll);
  }

  Future<void> _loadStats() async {
    final stats = await _dashboardService.getDashboardStats();
    if (mounted) setState(() => _stats = stats);
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

  List<Map<String, dynamic>> _mapRawData(List<dynamic> rawList) {
    List<Map<String, dynamic>> result = [];
    for (var item in rawList) {
      if (item is! Map<String, dynamic>) continue;
      
      String status = 'Ditolak';
      final sa = item['status_ajuan']?.toString();
      if (sa == 'MENUNGGU') status = 'Menunggu Verifikasi';
      else if (sa == 'PROSES' || sa == 'SEDANG_DITINJAU') status = 'Diproses';
      else if (sa == 'DISETUJUI') status = 'Disetujui';
      else if (sa == 'REVISI' || sa == 'PERLU_PERBAIKAN') status = 'Perlu Revisi';
      else if (sa == 'DRAFT') status = 'Draft';

      final idTransaksi = item['id_transaksi']?.toString() ?? item['id']?.toString() ?? '';
      final tgl = item['tanggal_pengajuan']?.toString() ?? '';

      if (item['jenis_transaksi'] == 'HAPUS') {
        final detailAsal = item['detail_asal'] as List<dynamic>?;
        if (detailAsal == null || detailAsal.isEmpty) continue;
        for (var asal in detailAsal) {
          if (asal is! Map<String, dynamic>) continue;
          final objekAsal = asal['objek_asal'] as Map<String, dynamic>?;
          
          String address = 'PENGHAPUSAN OBJEK PAJAK';
          if (objekAsal != null) {
            final jalan = objekAsal['jalan_op'] ?? '';
            final rt = objekAsal['rt_op'] ?? '';
            final rw = objekAsal['rw_op'] ?? '';
            address = '$jalan RT $rt/$rw'.trim();
          }

          result.add({
            'id': idTransaksi,
            'id_detail': asal['id_detail_asal'],
            'nop': asal['nop_asal'] ?? 'Menunggu NOP',
            'name': item['nama_pengaju'] ?? 'Tanpa Nama',
            'address': address,
            'land': objekAsal?['luas_tanah'] ?? 0,
            'building': objekAsal?['luas_bangunan'] ?? 0,
            'status': status,
            'status_ajuan': sa,
            'date': tgl,
          });
        }
      } else {
        final detailTujuan = item['detail_tujuan'] as List<dynamic>?;
        if (detailTujuan == null || detailTujuan.isEmpty) continue;
        for (var detail in detailTujuan) {
          if (detail is! Map<String, dynamic>) continue;
          
          final calonSubjek = detail['calon_subjek_json'] as Map<String, dynamic>?;
          String name = 'Tanpa Nama';
          if (calonSubjek != null && calonSubjek['nama_subjek'] != null) {
            name = calonSubjek['nama_subjek'];
          } else if (item['nama_pengaju'] != null) {
            name = item['nama_pengaju'];
          }

          final jalan = detail['jalan_op_baru'] ?? '';
          final rt = detail['rt_op_baru'] != null ? 'RT ${detail['rt_op_baru']}' : '';
          final rw = detail['rw_op_baru'] != null ? 'RW ${detail['rw_op_baru']}' : '';
          final kel = detail['kelurahan_op_baru'] ?? '';
          final address = '$jalan $rt $rw $kel'.trim();

          result.add({
            'id': idTransaksi,
            'id_detail': detail['id_detail_tujuan'],
            'nop': detail['nop_generated'] ?? detail['no_persil_baru'] ?? 'Menunggu NOP',
            'name': name,
            'address': address.isEmpty ? '-' : address,
            'land': detail['luas_tanah_baru'] ?? 0,
            'building': detail['luas_bangunan_baru'] ?? 0,
            'status': status,
            'status_ajuan': sa,
            'date': tgl,
          });
        }
      }
    }
    return result;
  }

  Future<void> _loadData({bool reset = false}) async {
    if (reset) {
      setState(() { _isLoading = true; _errorMsg = null; _page = 1; _hasMore = false; });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      if (reset) {
        final raw = await _spopService.getTransaksiSaya();
        _rawData = _mapRawData(raw);
      }
      
      var filtered = _rawData;
      if (_selectedFilter != 'Semua Status') {
        final mappedStatus = _mapFilterToStatusAjuan(_selectedFilter);
        filtered = filtered.where((e) => e['status_ajuan'] == mappedStatus).toList();
      }
      
      if (_searchController.text.isNotEmpty) {
        final search = _searchController.text.toLowerCase();
        filtered = filtered.where((e) {
          final s = e['name']?.toString().toLowerCase() ?? '';
          final n = e['nop']?.toString().toLowerCase() ?? '';
          final a = e['address']?.toString().toLowerCase() ?? '';
          return s.contains(search) || n.contains(search) || a.contains(search);
        }).toList();
      }

      setState(() {
        _data = filtered;
      });
    } on DioException catch (e) {
      setState(() => _errorMsg = e.response?.data?['message'] ?? e.message);
    } catch (e) {
      setState(() => _errorMsg = e.toString());
    } finally {
      setState(() { _isLoading = false; _isLoadingMore = false; });
    }
  }

  Color _getStatusColor(String statusAjuan, ColorScheme colorScheme) {
    if (statusAjuan == 'DRAFT') return Colors.grey.shade600;
    if (statusAjuan == 'MENUNGGU') return Colors.blue.shade600;
    if (statusAjuan == 'PROSES' || statusAjuan == 'SEDANG_DITINJAU') return Colors.orange.shade600;
    if (statusAjuan == 'REVISI' || statusAjuan == 'PERLU_PERBAIKAN') return Colors.red.shade600;
    if (statusAjuan == 'DISETUJUI') return Colors.green.shade600;
    if (statusAjuan == 'DITOLAK') return Colors.red.shade800;
    return Colors.blue.shade600;
  }

  String _getStatusLabelText(String statusAjuan) {
    if (statusAjuan == 'DRAFT') return 'Draft';
    if (statusAjuan == 'MENUNGGU') return 'Menunggu Verifikasi';
    if (statusAjuan == 'PROSES' || statusAjuan == 'SEDANG_DITINJAU') return 'Diproses';
    if (statusAjuan == 'REVISI' || statusAjuan == 'PERLU_PERBAIKAN') return 'Perlu Revisi';
    if (statusAjuan == 'DISETUJUI') return 'Disetujui';
    if (statusAjuan == 'DITOLAK') return 'Ditolak';
    return 'Ditolak';
  }

  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd MMM yyyy', 'id').format(DateTime.parse(iso).toLocal()); } catch(_) { return iso; }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F9),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async {
                  _loadStats();
                  await _loadData(reset: true);
                },
                color: _kNavy,
                child: CustomScrollView(
                  controller: _scrollController,
                  physics: const AlwaysScrollableScrollPhysics(),
                  slivers: [
                    SliverToBoxAdapter(
                      child: _buildFilterSection(theme),
                    ),
                    _buildListContent(theme),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  static const Color _kNavy = Color(0xFF0F2C59);

  Widget _buildFilterSection(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 3,
            child: TextField(
              controller: _searchController,
              style: const TextStyle(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Cari NOP/Nama...',
                prefixIcon: const Icon(Icons.search, size: 20, color: Colors.grey),
                isDense: true,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: _kNavy),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
              onSubmitted: (_) => _loadData(reset: true),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: DropdownButtonFormField<String>(
              isExpanded: true,
              value: _selectedFilter,
              style: const TextStyle(fontSize: 14, color: Colors.black87),
              decoration: InputDecoration(
                isDense: true,
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: _kNavy),
                ),
              ),
              dropdownColor: Colors.white,
              borderRadius: BorderRadius.circular(12),
              icon: const Icon(Icons.keyboard_arrow_down, size: 20, color: Colors.grey),
              items: _filters.map((f) {
                return DropdownMenuItem(value: f, child: Text(f, overflow: TextOverflow.ellipsis));
              }).toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() => _selectedFilter = val);
                  _loadData(reset: true);
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildListContent(ThemeData theme) {
    if (_isLoading) {
      return const SliverFillRemaining(child: Center(child: CircularProgressIndicator()));
    }
    if (_errorMsg != null) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
              const SizedBox(height: 8),
              Text(_errorMsg!, style: TextStyle(color: theme.colorScheme.error)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => _loadData(reset: true),
                icon: const Icon(Icons.refresh),
                label: const Text('Coba Lagi'),
              ),
            ],
          ),
        ),
      );
    }
    if (_data.isEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.inbox_outlined, size: 64, color: Colors.grey.shade400),
              const SizedBox(height: 16),
              Text('Tidak ada data ditemukan', style: TextStyle(color: Colors.grey.shade500)),
            ],
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            if (index >= _data.length) {
              return const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()));
            }

            final d = _data[index];
            final statusAjuan = d['status_ajuan']?.toString() ?? '';
            final statusColor = _getStatusColor(statusAjuan, theme.colorScheme);
            final statusLabel = _getStatusLabelText(statusAjuan);
            final nama = d['name']?.toString() ?? '-';
            final alamat = d['address']?.toString() ?? '-';
            final nop = d['nop']?.toString() ?? 'Menunggu NOP';
            final idTransaksi = d['id']?.toString() ?? '';
            final luasTanah = d['land']?.toString() ?? '0';

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: Colors.grey.shade300),
              ),
              elevation: 0,
              color: Colors.white,
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () {
                  if (idTransaksi.isNotEmpty) {
                    final sa = d['status_ajuan'];
                    if (sa == 'DRAFT' || sa == 'REVISI' || sa == 'PERLU_PERBAIKAN') {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const SpopFormScreen(),
                        ),
                      );
                    } else {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PelacakanDokumenDetailScreen(idTransaksi: idTransaksi),
                        ),
                      );
                    }
                  }
                },
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
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: _kNavy),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              statusLabel,
                              style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        nama,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.black87),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        alamat,
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.landscape, size: 14, color: Colors.grey.shade600),
                                const SizedBox(width: 4),
                                Text('Tanah $luasTanah m²', style: TextStyle(color: Colors.grey.shade700, fontSize: 12, fontWeight: FontWeight.w500)),
                              ],
                            ),
                          ),
                          (d['status_ajuan'] == 'DRAFT' || d['status_ajuan'] == 'REVISI' || d['status_ajuan'] == 'PERLU_PERBAIKAN')
                              ? Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: _kNavy.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Icon(
                                    Icons.edit_document,
                                    size: 16,
                                    color: _kNavy,
                                  ),
                                )
                              : Icon(
                                  Icons.chevron_right,
                                  size: 22,
                                  color: Colors.grey.shade400,
                                ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
          childCount: _data.length + (_hasMore ? 1 : 0),
        ),
      ),
    );
  }
}
