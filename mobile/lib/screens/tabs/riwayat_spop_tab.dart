import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../../services/api_service.dart';
import '../../services/transaksi_spop_service.dart';
import '../detail_review_spop_screen.dart';

class RiwayatSpopTab extends StatefulWidget {
  const RiwayatSpopTab({super.key});

  @override
  State<RiwayatSpopTab> createState() => _RiwayatSpopTabState();
}

class _RiwayatSpopTabState extends State<RiwayatSpopTab> {
  final _spopService = TransaksiSpopService(ApiService());
  final _storage = const FlutterSecureStorage();
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _riwayat = [];
  bool _isLoading = true;
  String? _errorMsg;
  String _filterStatus = 'Semua';

  @override
  void initState() {
    super.initState();
    _loadRiwayat(showLoading: true);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadRiwayat({bool showLoading = true}) async {
    if (showLoading && mounted)
      setState(() {
        _isLoading = true;
        _errorMsg = null;
      });
    try {
      final futures = await Future.wait([
        _spopService.getAntreanVerifikasi(status: 'DISETUJUI'),
        _spopService.getAntreanVerifikasi(status: 'DITOLAK'),
      ]);

      final List<Map<String, dynamic>> allData = [...futures[0], ...futures[1]];

      // Sort by tanggal_pengajuan (created_at) desc (newest first)
      allData.sort((a, b) {
        final dateA =
            DateTime.tryParse(
              a['tanggal_pengajuan'] ?? a['created_at'] ?? '',
            ) ??
            DateTime.now();
        final dateB =
            DateTime.tryParse(
              b['tanggal_pengajuan'] ?? b['created_at'] ?? '',
            ) ??
            DateTime.now();
        return dateB.compareTo(dateA);
      });

      if (mounted) {
        setState(() {
          _riwayat = allData;
          _errorMsg = null;
          _isLoading = false;
        });
      }
    } on DioException catch (e) {
      if (mounted)
        setState(() {
          _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat riwayat';
          _isLoading = false;
        });
    } catch (e) {
      if (mounted)
        setState(() {
          _errorMsg = 'Terjadi kesalahan: $e';
          _isLoading = false;
        });
    }
  }

  Future<void> _navigateToDetail(Map<String, dynamic> item) async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            DetailReviewSpopScreen(idTransaksi: item['id_transaksi']),
      ),
    );
    _loadRiwayat(showLoading: false);
  }

  String _formatNop(String? raw) {
    if (raw == null || raw.isEmpty) return '-';
    final clean = raw.replaceAll(RegExp(r'\D'), '');
    if (clean.length == 18) {
      return '${clean.substring(0, 2)}.${clean.substring(2, 4)}.${clean.substring(4, 7)}.${clean.substring(7, 10)}.${clean.substring(10, 13)}.${clean.substring(13, 17)}.${clean.substring(17, 18)}';
    }
    if (raw.contains('...')) return 'Menunggu penetapan';
    return raw;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Filter
    final query = _searchController.text.toLowerCase();
    final filtered = _riwayat.where((item) {
      if (_filterStatus != 'Semua') {
        final status = item['status_ajuan']?.toString().toUpperCase();
        if (status != _filterStatus.toUpperCase()) return false;
      }
      if (query.isEmpty) return true;
      final detailTujuanRaw = item['detail_tujuan'];
      final t = detailTujuanRaw is List ? detailTujuanRaw : (detailTujuanRaw is Map ? [detailTujuanRaw] : []);
      final t0 = t.isNotEmpty ? t[0] : {};
      final name =
          t0['calon_subjek_json']?['nama_subjek'] ??
          item['pengaju']?['nama_lengkap'] ??
          '';
      final nop = t0['nop_generated'] ?? '';
      return name.toString().toLowerCase().contains(query) ||
          nop.toString().toLowerCase().contains(query);
    }).toList();

    return Column(
      children: [
        // Header (Search & Filter)
        Container(
          color: theme.colorScheme.surface,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: _searchController,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: 'Cari NOP atau Nama...',
                  prefixIcon: const Icon(Icons.search, color: Colors.grey),
                  filled: true,
                  fillColor: theme.colorScheme.surfaceContainerHighest
                      .withValues(alpha: 0.3),
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: theme.colorScheme.outlineVariant,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: theme.colorScheme.outlineVariant,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: ['Semua', 'Disetujui', 'Ditolak', 'Revisi'].map((status) {
                    final isSelected = _filterStatus == status;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(status),
                        selected: isSelected,
                        onSelected: (bool selected) {
                          setState(() {
                            _filterStatus = status;
                          });
                        },
                        selectedColor: const Color(0xFF0C2A5B), // Navy Bakeuda
                        labelStyle: TextStyle(
                          color: isSelected
                              ? Colors.white
                              : theme.colorScheme.onSurface,
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                        showCheckmark: false,
                        backgroundColor: theme
                            .colorScheme
                            .surfaceContainerHighest
                            .withValues(alpha: 0.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1, thickness: 1),

        // List View
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMsg != null
              ? Center(
                  child: Text(
                    _errorMsg!,
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                )
              : filtered.isEmpty
              ? Center(
                  child: Text(
                    'Tidak ada riwayat saat ini.',
                    style: theme.textTheme.bodyMedium,
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => _loadRiwayat(showLoading: true),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      final detailTujuanRaw = item['detail_tujuan'];
                      final t = detailTujuanRaw is List ? detailTujuanRaw : (detailTujuanRaw is Map ? [detailTujuanRaw] : []);
                      final t0 = t.isNotEmpty ? t[0] : {};

                      final nop = _formatNop(t0['nop_generated']);
                      final subjekName =
                          t0['calon_subjek_json']?['nama_subjek'];
                      final name =
                          (subjekName != null &&
                              subjekName.toString().toUpperCase() !=
                                  'TANPA NAMA')
                          ? subjekName
                          : (item['pengaju']?['nama_lengkap'] ??
                                item['nama_pengaju'] ??
                                'Tanpa Nama');
                      final address =
                          t0['jalan_op_baru'] ??
                          t0['jenis_tanah_baru']?.toString().replaceAll(
                            '_',
                            ' ',
                          ) ??
                          '-';
                      final dateStr =
                          item['tanggal_pengajuan'] ?? item['created_at'];
                      final date = dateStr != null
                          ? DateFormat('dd MMM yyyy • HH:mm', 'id').format(
                              DateTime.tryParse(dateStr)?.toLocal() ??
                                  DateTime.now(),
                            )
                          : '-';

                      final status = item['status_ajuan']
                          ?.toString()
                          .toUpperCase();

                      String badgeText = status ?? '-';
                      Color badgeBg = Colors.grey.withValues(alpha: 0.1);
                      Color badgeColor = Colors.grey;

                      if (status == 'DISETUJUI') {
                        badgeBg = Colors.green.withValues(alpha: 0.1);
                        badgeColor = Colors.green.shade700;
                      } else if (status == 'DITOLAK') {
                        badgeBg = Colors.red.withValues(alpha: 0.1);
                        badgeColor = Colors.red.shade700;
                      }

                      return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: theme.colorScheme.outlineVariant,
                              ),
                            ),
                            elevation: 0,
                            child: InkWell(
                              onTap: () => _navigateToDetail(item),
                              borderRadius: BorderRadius.circular(12),
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          nop,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                            letterSpacing: 1,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: badgeBg,
                                            borderRadius: BorderRadius.circular(
                                              6,
                                            ),
                                          ),
                                          child: Text(
                                            badgeText,
                                            style: TextStyle(
                                              color: badgeColor,
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      name.toString(),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.location_on_outlined,
                                          size: 14,
                                          color: theme
                                              .colorScheme
                                              .onSurfaceVariant,
                                        ),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            address.toString(),
                                            style: theme.textTheme.bodySmall
                                                ?.copyWith(
                                                  color: theme
                                                      .colorScheme
                                                      .onSurfaceVariant,
                                                ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.schedule,
                                          size: 14,
                                          color: theme
                                              .colorScheme
                                              .onSurfaceVariant,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          date,
                                          style: theme.textTheme.bodySmall
                                              ?.copyWith(
                                                color: theme
                                                    .colorScheme
                                                    .onSurfaceVariant,
                                              ),
                                        ),
                                        const Spacer(),
                                        Icon(
                                          Icons.chevron_right,
                                          color: theme
                                              .colorScheme
                                              .onSurfaceVariant,
                                          size: 20,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          )
                          .animate()
                          .fade(duration: 300.ms)
                          .slideY(begin: 0.1, curve: Curves.easeOut);
                    },
                  ),
                ),
        ),
      ],
    );
  }
}
