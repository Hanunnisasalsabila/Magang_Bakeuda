import 'package:flutter/material.dart';
import '../../services/dashboard_service.dart';
import '../daftar_objek_pajak_screen.dart';
import 'verifikasi_spop_tab.dart';
import 'riwayat_spop_tab.dart';

class AdminDashboardTab extends StatefulWidget {
  final VoidCallback onNavigateToVerification;
  final VoidCallback onNavigateToHistory;

  const AdminDashboardTab({
    super.key,
    required this.onNavigateToVerification,
    required this.onNavigateToHistory,
  });

  @override
  State<AdminDashboardTab> createState() => _AdminDashboardTabState();
}

class _AdminDashboardTabState extends State<AdminDashboardTab> {
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
      _dashboardService.getActiveVerifiers(),
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
    if (status.contains('PERBAIKAN') || status.contains('REVISI'))
      return Colors.orange;
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

  String _formatNOP(String nop, String type, String status) {
    if ((nop.isEmpty || nop.contains('...') || nop == 'Menunggu NOP' || type == 'BARU' || type == 'PECAH' || type == 'GABUNG') && status != 'DISETUJUI') {
      return '(NOP Belum Tersedia)';
    }
    if (nop.isEmpty || nop.contains('...')) return '(NOP Belum Tersedia)';
    
    final clean = nop.replaceAll(RegExp(r'\D'), '');
    if (clean.length == 18) {
      return 'NOP. ${clean.substring(0, 2)}.${clean.substring(2, 4)}.${clean.substring(4, 7)}.${clean.substring(7, 10)}.${clean.substring(10, 13)}.${clean.substring(13, 17)}.${clean.substring(17, 18)}';
    }
    return 'NOP. $nop';
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
      color: theme.colorScheme.surface,
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
                'Ringkasan keseluruhan',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                  color: theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 24),
              _buildOverviewCards(theme),
              const SizedBox(height: 24),
              _buildActionButton(theme),
              const SizedBox(height: 32),
              _buildChartSection(theme),
              const SizedBox(height: 32),
              _buildRecentActivity(theme),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewCards(ThemeData theme) {
    final totalDikirim = _stats?['totalDikirim']?.toString() ?? '0';
    final menunggu = _stats?['menunggu']?.toString() ?? '0';

    return Row(
      children: [
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFFE2E8F0),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Total pengajuan',
                  style: TextStyle(
                    fontSize: 12,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  totalDikirim,
                  style: const TextStyle(
                    fontSize: 32,
                    color: Color(0xFF0C2A5B), // Navy blue
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Seluruh berkas',
                  style: TextStyle(
                    fontSize: 10,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Color(0xFFFEF2F2), // Light red background
                border: Border(
                  top: BorderSide(color: Color(0xFFFCA5A5)),
                  right: BorderSide(color: Color(0xFFFCA5A5)),
                  bottom: BorderSide(color: Color(0xFFFCA5A5)),
                  left: BorderSide(
                    color: Color(0xFFDC2626),
                    width: 4,
                  ), // Thick red left border
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Antrean verifikasi',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF991B1B), // Dark red
                    ),
                  ),
                const SizedBox(height: 12),
                Text(
                  menunggu,
                  style: const TextStyle(
                    fontSize: 32,
                    color: Color(0xFF991B1B), // Dark red
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Segera proses',
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF991B1B), // Dark red
                  ),
                ),
              ],
            ),
          ),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(ThemeData theme) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: widget.onNavigateToVerification,
        icon: const Icon(Icons.check_circle_outline, size: 20),
        label: const Text('Mulai verifikasi'),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF0C2A5B), // Navy blue
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          elevation: 0,
        ),
      ),
    );
  }

  Widget _buildChartSection(ThemeData theme) {
    final List<dynamic>? weeklyTrends = _stats?['weeklyTrends'];
    List<double> heights = [0, 0, 0, 0, 0];

    if (weeklyTrends != null && weeklyTrends.length == 5) {
      double maxCount = 0;
      for (var count in weeklyTrends) {
        if (count > maxCount) maxCount = (count as num).toDouble();
      }

      for (int i = 0; i < 5; i++) {
        double count = (weeklyTrends[i] as num).toDouble();
        if (maxCount > 0 && count > 0) {
          // Calculate height relative to max (max height 70, min height 10 for visibility if > 0)
          heights[i] = (count / maxCount) * 70;
          if (heights[i] < 10) heights[i] = 10;
        }
      }
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE2E8F0)), // Light grey border
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tren pengajuan mingguan',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 16),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              _buildChartBar(heights[0], 'Sen', 0),
              _buildChartBar(heights[1], 'Sel', 1),
              _buildChartBar(heights[2], 'Rab', 2),
              _buildChartBar(heights[3], 'Kam', 3),
              _buildChartBar(heights[4], 'Jum', 4),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChartBar(double height, String label, int index) {
    final int todayIndex = DateTime.now().weekday - 1;
    final bool isToday = index == todayIndex;
    final bool hasData = height > 0;
    
    return Column(
      children: [
        Container(
          width: 40, // Wider bars to match design
          height: hasData ? height : 4, // Minimum height so it's not invisible
          decoration: BoxDecoration(
            color: (isToday && hasData)
                ? const Color(0xFFC9A227) // Gold only if it's today AND has data
                : const Color(0xFF0C2A5B), // Navy for previous days or empty
            borderRadius: const BorderRadius.vertical(top: Radius.circular(2)),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: Colors.black87),
        ),
      ],
    );
  }

  Widget _buildRecentActivity(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Aktivitas terakhir',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.onSurface,
              ),
            ),
            InkWell(
              onTap: widget.onNavigateToHistory,
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                child: Text(
                  'Lihat semua',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
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
            itemCount: _recentTransactions.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final trx = _recentTransactions[index];
              final detailTujuanRaw = trx['detail_tujuan'];
              final detail = detailTujuanRaw is List ? detailTujuanRaw.firstOrNull : (detailTujuanRaw is Map ? detailTujuanRaw : null);
              final type = trx['jenis_transaksi'] ?? 'SPOP';
              final status = trx['status_ajuan'] ?? 'UNKNOWN';

              List<String> nops = [];
              if (type == 'HAPUS' && trx['detail_asal'] is List && (trx['detail_asal'] as List).isNotEmpty) {
                for (var d in trx['detail_asal']) {
                  String n = d['nop_asal'] ?? '';
                  nops.add(_formatNOP(n, type, status));
                }
              } else if (trx['detail_tujuan'] is List && (trx['detail_tujuan'] as List).isNotEmpty) {
                for (var d in trx['detail_tujuan']) {
                  String n = d['nop_generated'] ?? d['no_persil_baru'] ?? '';
                  nops.add(_formatNOP(n, type, status));
                }
              } else {
                nops.add('(NOP Belum Tersedia)');
              }
                  
              final String? subjekName = (detail?['calon_subjek_json'] as Map?)?['nama_subjek']?.toString();
              String name = 'Tanpa Nama';
              if (subjekName != null && subjekName.toUpperCase() != 'TANPA NAMA') {
                name = subjekName;
              } else {
                name = trx['nama_pengaju'] ?? (trx['pengaju'] as Map?)?['nama_lengkap'] ?? 'Tanpa Nama';
              }
              
              final String dateStr = trx['tanggal_pengajuan'] ?? trx['created_at'] ?? '';
              String timeAgo = 'Baru saja';
              if (dateStr.isNotEmpty) {
                final date = DateTime.tryParse(dateStr);
                if (date != null) {
                  final diff = DateTime.now().difference(date);
                  if (diff.inDays > 7) {
                    timeAgo = '${date.day}/${date.month}/${date.year}';
                  } else if (diff.inDays > 0) {
                    timeAgo = '${diff.inDays} hari lalu';
                  } else if (diff.inHours > 0) {
                    timeAgo = '${diff.inHours} jam lalu';
                  } else if (diff.inMinutes > 0) {
                    timeAgo = '${diff.inMinutes} mnt lalu';
                  }
                }
              }
              final statusColor = _getStatusColor(status, theme.colorScheme);

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.description_outlined,
                        color: statusColor,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            type.toString().replaceAll('_', ' '),
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                          const SizedBox(height: 4),
                          ...nops.map((nopDisplay) => Padding(
                            padding: const EdgeInsets.only(bottom: 2),
                            child: Text(
                              'ID: $nopDisplay • $name',
                              style: TextStyle(
                                color: nopDisplay.contains('Belum') ? Colors.grey.shade500 : theme.colorScheme.onSurfaceVariant,
                                fontStyle: nopDisplay.contains('Belum') ? FontStyle.italic : FontStyle.normal,
                                fontSize: 11,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          )),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _formatStatusText(status),
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: statusColor,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          timeAgo,
                          style: TextStyle(
                            fontSize: 10,
                            color: theme.colorScheme.onSurfaceVariant
                                .withValues(alpha: 0.6),
                          ),
                        ),
                      ],
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
