import 'package:flutter/material.dart';
import 'dart:ui';
import '../../services/dashboard_service.dart';

class DesaDashboardTab extends StatefulWidget {
  const DesaDashboardTab({super.key});

  @override
  State<DesaDashboardTab> createState() => _DesaDashboardTabState();
}

class _DesaDashboardTabState extends State<DesaDashboardTab> {
  final DashboardService _dashboardService = DashboardService();
  bool _isLoading = true;
  
  Map<String, dynamic>? _stats;
  List<dynamic> _recentTransactions = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    
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
    if (status.contains('MENUNGGU')) return Colors.blue;
    if (status.contains('DISETUJUI')) return Colors.green;
    if (status.contains('DITOLAK')) return colorScheme.error;
    if (status.contains('PERBAIKAN') || status.contains('REVISI')) return Colors.orange;
    if (status == 'DRAFT') return Colors.grey;
    return Colors.grey;
  }

  String _formatStatusText(String status) {
    if (status.contains('MENUNGGU')) return 'Menunggu';
    if (status.contains('DISETUJUI')) return 'Selesai';
    if (status.contains('DITOLAK')) return 'Ditolak';
    if (status.contains('PERBAIKAN') || status.contains('REVISI')) return 'Revisi';
    return status.replaceAll('_', ' ');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(color: theme.colorScheme.primary),
      );
    }

    return Container(
      color: theme.colorScheme.background,
      child: RefreshIndicator(
        onRefresh: _fetchData,
        color: theme.colorScheme.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics(),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Selamat Pagi, Perangkat Desa',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Mari selesaikan laporan pajak hari ini dengan\nmudah.',
                style: TextStyle(
                  fontSize: 12,
                  color: theme.colorScheme.onSurfaceVariant,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),
              _buildNewSpopButton(theme),
              const SizedBox(height: 24),
              _buildStackedStats(theme),
              const SizedBox(height: 32),
              _buildRecentActivity(theme),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNewSpopButton(ThemeData theme) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFF1E3A8A), // Deep Blue
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1E3A8A).withOpacity(0.3),
                blurRadius: 15,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.add, color: Color(0xFF1E3A8A), size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Buat SPOP Baru',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Mulai pendataan objek pajak baru',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.white, size: 28),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStackedStats(ThemeData theme) {
    final dikirim = _stats?['totalDikirim']?.toString() ?? '0';
    final menunggu = _stats?['menunggu']?.toString() ?? '0';
    final revisi = _stats?['perluPerbaikan']?.toString() ?? '0';

    return Column(
      children: [
        _buildStatRow(
          title: 'SPOP DIKIRIM',
          value: dikirim,
          icon: Icons.send_rounded,
          iconColor: const Color(0xFF4F46E5), // Indigo
          bgColor: const Color(0xFFF8FAFC), // Slate 50
        ),
        const SizedBox(height: 12),
        _buildStatRow(
          title: 'MENUNGGU',
          value: menunggu,
          icon: Icons.pending_actions_rounded,
          iconColor: const Color(0xFFD97706), // Amber
          bgColor: const Color(0xFFFFFBEB), // Amber 50
        ),
        const SizedBox(height: 12),
        _buildStatRow(
          title: 'PERLU REVISI',
          value: revisi,
          icon: Icons.assignment_return_rounded,
          iconColor: const Color(0xFFDC2626), // Red
          bgColor: const Color(0xFFFEF2F2), // Red 50
        ),
      ],
    );
  }

  Widget _buildStatRow({
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                    color: Colors.black.withOpacity(0.5),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
          ),
        ],
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
          ],
        ),
        const SizedBox(height: 16),
        if (_recentTransactions.isEmpty)
          const Center(child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Text('Belum ada aktivitas'),
          ))
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentTransactions.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final trx = _recentTransactions[index];
              final detail = (trx['detail_tujuan'] as List?)?.firstOrNull;
              final nop = detail?['nop_generated'] ?? detail?['no_persil_baru'] ?? 'Menunggu NOP';
              final status = trx['status_ajuan'] ?? 'UNKNOWN';
              final statusColor = _getStatusColor(status, theme.colorScheme);
              final type = trx['jenis_transaksi'] ?? 'SPOP';
              
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: statusColor.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.check_circle_outline, 
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
                            children: [
                              Expanded(
                                child: Text(
                                  '${type.toString().replaceAll('_', ' ')} No. $nop',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold, 
                                    fontSize: 13,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Text(
                                '10mnt\nlalu', // placeholder
                                textAlign: TextAlign.right,
                                style: TextStyle(
                                  fontSize: 9,
                                  color: theme.colorScheme.onSurfaceVariant.withOpacity(0.6),
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
                          const SizedBox(height: 6),
                          Text(
                            'SPOP telah masuk dalam sistem dan sedang diproses.',
                            style: TextStyle(
                              color: theme.colorScheme.onSurfaceVariant,
                              fontSize: 11,
                              height: 1.4,
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
          const SizedBox(height: 16),
          Center(
            child: TextButton(
              onPressed: () {},
              child: const Text(
                'Lihat Semua Aktivitas',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1E3A8A),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
