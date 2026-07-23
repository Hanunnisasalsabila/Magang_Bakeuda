import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../services/dashboard_service.dart';
import '../spop_form_screen.dart';
import '../pelacakan_dokumen_screen.dart';

class DesaDashboardTab extends StatefulWidget {
  final VoidCallback? onLihatSemua;
  final VoidCallback? onLihatDraf;
  const DesaDashboardTab({super.key, this.onLihatSemua, this.onLihatDraf});

  @override
  State<DesaDashboardTab> createState() => _DesaDashboardTabState();
}

class _DesaDashboardTabState extends State<DesaDashboardTab> {
  final DashboardService _dashboardService = DashboardService();
  bool _isLoading = true;

  Map<String, dynamic>? _stats;
  List<dynamic> _recentTransactions = [];
  String _profileName = 'Perangkat Desa';

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);

    // Load profile name from JWT token
    try {
      final token = await const FlutterSecureStorage().read(key: 'jwt_token');
      if (token != null) {
        final parts = token.split('.');
        if (parts.length == 3) {
          final payload = json.decode(
            utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
          );
          _profileName = payload['nama_lengkap'] ?? 'Perangkat Desa';
        }
      }
    } catch (_) {}

    final results = await Future.wait([
      _dashboardService.getDashboardStats(),
      _dashboardService.getRecentTransactions(),
    ]);

    if (mounted) {
      setState(() {
        _stats = results[0] as Map<String, dynamic>?;
        _recentTransactions = results[1] as List<dynamic>? ?? [];
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(String status, ColorScheme colorScheme) {
    if (status.contains('MENUNGGU')) return const Color(0xFFD97706);
    if (status.contains('DISETUJUI')) return Colors.green;
    if (status.contains('DITOLAK')) return colorScheme.error;
    if (status.contains('PERBAIKAN') || status.contains('REVISI'))
      return Colors.redAccent;
    if (status == 'DRAFT') return Colors.grey;
    return Colors.grey;
  }

  String _formatStatusText(String status) {
    if (status.contains('MENUNGGU')) return 'Menunggu';
    if (status.contains('DISETUJUI')) return 'Selesai';
    if (status.contains('DITOLAK')) return 'Ditolak';
    if (status.contains('PERBAIKAN') || status.contains('REVISI'))
      return 'Revisi';
    return status.replaceAll('_', ' ');
  }

  // Greeting handled directly in build method.

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      color: const Color(0xFFF8F9FA), // Slightly off-white for background
      child: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: theme.colorScheme.primary,
              ),
            )
          : RefreshIndicator(
              onRefresh: _fetchData,
              color: theme.colorScheme.primary,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(
                  parent: BouncingScrollPhysics(),
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 24,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    _buildStackedStats(theme),
                    const SizedBox(height: 24),
                    _buildAksesCepat(context, theme),
                    const SizedBox(height: 24),
                    _buildRecentActivity(theme),
                    const SizedBox(height: 60),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStackedStats(ThemeData theme) {
    final dikirim = _stats?['totalDikirim']?.toString() ?? '0';
    final menunggu = _stats?['menunggu']?.toString() ?? '0';
    final disetujui = _stats?['disetujui']?.toString() ?? '0';
    final revisi = _stats?['perluPerbaikan']?.toString() ?? '0';

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                title: 'TOTAL\nDIKIRIM',
                value: dikirim,
                icon: Icons.description_outlined,
                color: Colors.blue,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                title: 'MENUNGGU\nVERIFIKASI',
                value: menunggu,
                icon: Icons.hourglass_bottom,
                color: const Color(0xFFD97706),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                title: 'SPOP\nDISETUJUI',
                value: disetujui,
                icon: Icons.verified_outlined,
                color: Colors.green,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                title: 'PERLU\nPERBAIKAN',
                value: revisi,
                icon: Icons.edit_outlined,
                color: Colors.redAccent,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05), // Subtle full background tint
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withValues(alpha: 0.3), // Colored border
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              Expanded(
                child: Text(
                  value,
                  textAlign: TextAlign.right,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
              letterSpacing: 0.5,
              height: 1.3,
            ),
            maxLines: 2,
          ),
        ],
      ),
    );
  }

  Widget _buildAksesCepat(BuildContext context, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Akses Cepat',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildAksesCepatButton(
                context,
                icon: Icons.add_circle_outline,
                label: 'Buat Baru',
                color: Colors.blue,
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const SpopFormScreen()));
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildAksesCepatButton(
                context,
                icon: Icons.folder_open,
                label: 'Draf Saya',
                color: Colors.purple,
                onTap: () {
                  widget.onLihatDraf?.call();
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildAksesCepatButton(
                context,
                icon: Icons.storage,
                label: 'Data OP',
                color: Colors.teal,
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PelacakanDokumenScreen()));
                },
              ),
            ),
          ],
        )
      ],
    );
  }

  Widget _buildAksesCepatButton(BuildContext context, {required IconData icon, required String label, required Color color, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 4, offset: const Offset(0, 2))
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.black87), textAlign: TextAlign.center, maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivity(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Aktivitas Terbaru',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
              ),
            ),
            if (_recentTransactions.isNotEmpty)
              TextButton(
                onPressed: widget.onLihatSemua ?? () {},
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: const Size(50, 30),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text(
                  'Lihat semua',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1E3A8A), // Blue text
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 16),
        if (_recentTransactions.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(20.0),
              child: Text('Belum ada aktivitas'),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentTransactions.length > 5
                ? 5
                : _recentTransactions.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final trx = _recentTransactions[index];
              final detail = (trx['detail_tujuan'] as List?)?.firstOrNull;
              final status = trx['status_ajuan'] ?? 'UNKNOWN';
              final statusColor = _getStatusColor(status, theme.colorScheme);
              final type =
                  trx['jenis_transaksi']?.toString().replaceAll('_', ' ') ??
                  'SPOP';

              // Handle title based on NOP availability
              String nopStr =
                  detail?['nop_generated'] ?? detail?['no_persil_baru'] ?? '';
              String titleStr = nopStr.isEmpty || nopStr == 'Menunggu NOP'
                  ? '$type Menunggu NOP'
                  : '$type No. $nopStr';

              // Dynamic description based on status
              String descStr = 'Berkas SPOP sedang diproses dalam antrean.';
              if (status.contains('MENUNGGU')) {
                descStr =
                    'Menunggu verifikasi dan persetujuan dari petugas Bakeuda.';
              } else if (status.contains('DISETUJUI')) {
                descStr = 'SPOP telah disetujui dan data tersimpan di sistem.';
              } else if (status.contains('PERBAIKAN') ||
                  status.contains('REVISI')) {
                descStr =
                    'SPOP memerlukan perbaikan. Silakan periksa detailnya.';
              } else if (status.contains('DITOLAK')) {
                descStr = 'Pengajuan SPOP ditolak oleh Bakeuda.';
              }

              // Handle Date (if available)
              String dateStr = 'Baru saja';
              if (trx['created_at'] != null) {
                try {
                  final date = DateTime.parse(trx['created_at']);
                  final diff = DateTime.now().difference(date);
                  if (diff.inDays > 0) {
                    dateStr = '${diff.inDays} hari lalu';
                  } else if (diff.inHours > 0) {
                    dateStr = '${diff.inHours} jam lalu';
                  } else if (diff.inMinutes > 0) {
                    dateStr = '${diff.inMinutes} mnt lalu';
                  }
                } catch (e) {
                  // ignore formatting errors
                }
              }

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        status.contains('MENUNGGU')
                            ? Icons.schedule
                            : Icons.check_circle_outline,
                        color: statusColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Text(
                                  titleStr,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                dateStr,
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatStatusText(status),
                            style: TextStyle(
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            descStr,
                            style: TextStyle(
                              color: Colors.grey.shade700,
                              fontSize: 11,
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
      ],
    );
  }
}
