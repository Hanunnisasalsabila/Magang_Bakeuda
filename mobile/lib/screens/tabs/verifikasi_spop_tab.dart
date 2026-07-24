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

class VerifikasiSpopTab extends StatefulWidget {
  const VerifikasiSpopTab({super.key});

  @override
  State<VerifikasiSpopTab> createState() => _VerifikasiSpopTabState();
}

class _VerifikasiSpopTabState extends State<VerifikasiSpopTab> {
  final _spopService = TransaksiSpopService(ApiService());
  final _storage = const FlutterSecureStorage();
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _antrean = [];
  bool _isLoading = true;
  String? _errorMsg;
  String? _myId;
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _initData();
    _pollingTimer = Timer.periodic(const Duration(seconds: 15), (_) {
      _loadAntrean(showLoading: false);
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _initData() async {
    await _decodeUser();
    await _loadAntrean(showLoading: true);
  }

  Future<void> _decodeUser() async {
    try {
      final token = await _storage.read(key: 'jwt_token');
      if (token != null) {
        final parts = token.split('.');
        if (parts.length == 3) {
          final payload = json.decode(utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))));
          _myId = payload['userId']?.toString();
        }
      }
    } catch (_) {}
  }

  Future<void> _loadAntrean({bool showLoading = true}) async {
    if (showLoading && mounted) setState(() { _isLoading = true; _errorMsg = null; });
    try {
      final futures = await Future.wait([
        _spopService.getAntreanVerifikasi(status: 'MENUNGGU'),
        _spopService.getAntreanVerifikasi(status: 'PROSES'),
      ]);
      
      final List<Map<String, dynamic>> allData = [...futures[0], ...futures[1]];
      
      // Sort by updated_at or created_at desc
      allData.sort((a, b) {
        final dateA = DateTime.tryParse(a['updated_at'] ?? a['tanggal_pengajuan'] ?? '') ?? DateTime.now();
        final dateB = DateTime.tryParse(b['updated_at'] ?? b['tanggal_pengajuan'] ?? '') ?? DateTime.now();
        return dateB.compareTo(dateA);
      });

      if (mounted) {
        setState(() {
          _antrean = allData;
          _errorMsg = null;
          _isLoading = false;
        });
      }
    } on DioException catch (e) {
      if (mounted) setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; _isLoading = false; });
    } catch (e) {
      if (mounted) setState(() { _errorMsg = 'Terjadi kesalahan: $e'; _isLoading = false; });
    }
  }



  Future<void> _unlock(String id) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Lepas Kunci'),
        content: const Text('Apakah Anda yakin ingin melepas kunci verifikasi admin lain?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error, foregroundColor: Colors.white),
            onPressed: () => Navigator.pop(ctx, true), 
            child: const Text('Lepas Kunci')
          ),
        ],
      ),
    );

    if (ok == true && mounted) {
      try {
        await _spopService.unlockSpop(id);
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('✅ Kunci berhasil dilepas')));
        _loadAntrean(showLoading: true);
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal melepas kunci: $e')));
      }
    }
  }

  Future<void> _navigateToDetail(Map<String, dynamic> item, bool isLockedByOther) async {
    if (isLockedByOther) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Berkas sedang diverifikasi admin lain. Lepas kunci terlebih dahulu.')));
      return;
    }
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DetailReviewSpopScreen(idTransaksi: item['id_transaksi']),
      ),
    );

    if (result != null && mounted) {
      String title = 'Berhasil';
      String msg = '';
      IconData icon = Icons.check_circle;
      Color color = Colors.blue;

      if (result == 'DISETUJUI') {
        msg = 'Pengajuan berhasil disetujui';
        color = Colors.blue;
      } else if (result == 'REVISI') {
        title = 'Dikembalikan';
        msg = 'Pengajuan dikembalikan untuk direvisi';
        color = Colors.orange;
        icon = Icons.assignment_return;
      } else if (result == 'DITOLAK') {
        title = 'Ditolak';
        msg = 'Pengajuan telah ditolak permanen';
        color = Colors.red;
        icon = Icons.cancel;
      } else {
        msg = 'Pengajuan berhasil diproses';
      }

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) {
          Future.delayed(const Duration(milliseconds: 1500), () {
            if (Navigator.canPop(context)) Navigator.pop(context);
          });
          return Dialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TweenAnimationBuilder<double>(
                    tween: Tween<double>(begin: 0, end: 1),
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.elasticOut,
                    builder: (context, value, child) {
                      return Transform.scale(
                        scale: value,
                        child: Icon(icon, color: color, size: 80),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(msg, textAlign: TextAlign.center, style: const TextStyle(color: Colors.grey)),
                ],
              ),
            ),
          );
        }
      );
    }
    _loadAntrean(showLoading: false);
  }

  String _formatNop(String? raw) {
    if (raw == null || raw.isEmpty) return '-';
    final clean = raw.replaceAll(RegExp(r'\D'), '');
    if (clean.length == 18) {
      return '${clean.substring(0,2)}.${clean.substring(2,4)}.${clean.substring(4,7)}.${clean.substring(7,10)}.${clean.substring(10,13)}.${clean.substring(13,17)}.${clean.substring(17,18)}';
    }
    if (raw.contains('...')) return 'Menunggu penetapan';
    return raw;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    // Filter
    final query = _searchController.text.toLowerCase();
    final filtered = _antrean.where((item) {
      if (query.isEmpty) return true;
      final detailTujuanRaw = item['detail_tujuan'];
      final t = detailTujuanRaw is List ? detailTujuanRaw : (detailTujuanRaw is Map ? [detailTujuanRaw] : []);
      final t0 = t.isNotEmpty ? t[0] : {};
      final name = t0['calon_subjek_json']?['nama_subjek'] ?? item['pengaju']?['nama_lengkap'] ?? '';
      final nop = t0['nop_generated'] ?? '';
      return name.toString().toLowerCase().contains(query) || nop.toString().toLowerCase().contains(query);
    }).toList();

    return Column(
      children: [
        // Header Search Bar
        Container(
          color: theme.colorScheme.surface,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          child: TextField(
            controller: _searchController,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Cari NOP atau Nama...',
              prefixIcon: const Icon(Icons.search, color: Colors.grey),
              filled: true,
              fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.3),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: theme.colorScheme.outlineVariant)),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: theme.colorScheme.outlineVariant)),
            ),
          ),
        ),
        const Divider(height: 1, thickness: 1),

        // List View
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMsg != null
                  ? Center(child: Text(_errorMsg!, style: TextStyle(color: theme.colorScheme.error)))
                  : filtered.isEmpty
                      ? Center(child: Text('Tidak ada antrean saat ini.', style: theme.textTheme.bodyMedium))
                      : RefreshIndicator(
                          onRefresh: () => _loadAntrean(showLoading: true),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: filtered.length,
                            itemBuilder: (context, index) {
                              final item = filtered[index];
                              final detailTujuanRaw = item['detail_tujuan'];
                              final t = detailTujuanRaw is List ? detailTujuanRaw : (detailTujuanRaw is Map ? [detailTujuanRaw] : []);
                              final t0 = t.isNotEmpty ? t[0] : {};
                              
                              final nop = _formatNop(t0['nop_generated']);
                              final subjekName = t0['calon_subjek_json']?['nama_subjek'];
                              final name = (subjekName != null && subjekName.toString().toUpperCase() != 'TANPA NAMA') 
                                  ? subjekName 
                                  : (item['pengaju']?['nama_lengkap'] ?? item['nama_pengaju'] ?? 'Tanpa Nama');
                              final address = t0['jalan_op_baru'] ?? t0['jenis_tanah_baru']?.toString().replaceAll('_', ' ') ?? '-';
                              final dateStr = item['tanggal_pengajuan'];
                              final date = dateStr != null ? DateFormat('dd MMM yyyy • HH:mm', 'id').format(DateTime.tryParse(dateStr)?.toLocal() ?? DateTime.now()) : '-';
                              
                              final isProses = item['status_ajuan'] == 'PROSES';
                              final lockedBy = item['locked_by']?.toString();
                              final isLockedByMe = isProses && lockedBy == _myId && _myId != null;
                              final isLockedByOther = isProses && lockedBy != _myId && lockedBy != null;
                              final lockedByName = item['reviewer']?['nama_lengkap'] ?? 'Admin Lain';

                              String badgeText = 'Menunggu Verifikasi';
                              Color badgeBg = Colors.blue.withValues(alpha: 0.1);
                              Color badgeColor = Colors.blue;

                              if (isLockedByMe) {
                                badgeText = 'Sedang Anda Verifikasi';
                                badgeBg = Colors.orange.withValues(alpha: 0.1);
                                badgeColor = Colors.orange.shade800;
                              } else if (isLockedByOther) {
                                badgeText = 'Diverifikasi $lockedByName';
                                badgeBg = Colors.red.withValues(alpha: 0.1);
                                badgeColor = Colors.red.shade700;
                              }

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  side: BorderSide(color: theme.colorScheme.outlineVariant),
                                ),
                                elevation: 0,
                                child: InkWell(
                                  onTap: () => _navigateToDetail(item, isLockedByOther),
                                  borderRadius: BorderRadius.circular(12),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(nop, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1)),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                              decoration: BoxDecoration(color: badgeBg, borderRadius: BorderRadius.circular(6)),
                                              child: Text(badgeText, style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold)),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Text(name.toString(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Icon(Icons.location_on_outlined, size: 14, color: theme.colorScheme.onSurfaceVariant),
                                            const SizedBox(width: 4),
                                            Expanded(child: Text(address.toString(), style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant), maxLines: 1, overflow: TextOverflow.ellipsis)),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        Row(
                                          children: [
                                            Icon(Icons.schedule, size: 14, color: theme.colorScheme.onSurfaceVariant),
                                            const SizedBox(width: 4),
                                            Text(date, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                            const Spacer(),
                                            if (isLockedByOther)
                                              TextButton.icon(
                                                onPressed: () => _unlock(item['id_transaksi']),
                                                icon: const Icon(Icons.lock_open, size: 16),
                                                label: const Text('Lepas Kunci'),
                                                style: TextButton.styleFrom(
                                                  foregroundColor: theme.colorScheme.error,
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                                                  minimumSize: Size.zero,
                                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                                ),
                                              )
                                            else
                                              Icon(Icons.chevron_right, color: theme.colorScheme.onSurfaceVariant, size: 20),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ).animate().fade(duration: 300.ms).slideY(begin: 0.1, curve: Curves.easeOut);
                            },
                          ),
                        ),
        ),
      ],
    );
  }
}
