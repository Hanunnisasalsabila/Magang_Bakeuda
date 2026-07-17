import 'package:flutter/material.dart';
import '../detail_review_spop_screen.dart';

class VerifikasiSpopTab extends StatefulWidget {
  const VerifikasiSpopTab({super.key});

  @override
  State<VerifikasiSpopTab> createState() => _VerifikasiSpopTabState();
}

class _VerifikasiSpopTabState extends State<VerifikasiSpopTab> {
  // Dummy Data for SPOP waiting for verification
  final List<Map<String, dynamic>> _antreanVerifikasi = [
    {
      'id': 'REQ-001',
      'desa': 'Desa Bojanegara',
      'nama_wp': 'Siti Aminah',
      'jenis': 'Pendaftaran Baru',
      'tanggal': '15 Jul 2026',
    },
    {
      'id': 'REQ-002',
      'desa': 'Desa Karangbanjar',
      'nama_wp': 'Budi Santoso',
      'jenis': 'Mutasi Penuh',
      'tanggal': '14 Jul 2026',
    },
    {
      'id': 'REQ-003',
      'desa': 'Desa Kutasari',
      'nama_wp': 'Agus Pratama',
      'jenis': 'Mutasi Pecah',
      'tanggal': '14 Jul 2026',
    },
  ];

  void _navigateToDetail(BuildContext context, Map<String, dynamic> data) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => DetailReviewSpopScreen(data: data)),
    );

    if (result != null) {
      if (!context.mounted) return;
      if (result == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pengajuan Berhasil Disetujui!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pengajuan Ditolak.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Antrean Verifikasi SPOP',
                style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Menampilkan data pengajuan dari desa yang membutuhkan persetujuan BKD.',
                style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
            ],
          ),
        ),
        Expanded(
          child: _antreanVerifikasi.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.check_circle_outline, size: 64, color: theme.colorScheme.primary),
                      const SizedBox(height: 16),
                      Text('Semua pengajuan sudah diverifikasi!', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _antreanVerifikasi.length,
                  itemBuilder: (context, index) {
                    final data = _antreanVerifikasi[index];
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
                                Text(
                                  data['id'],
                                  style: TextStyle(
                                    color: theme.colorScheme.primary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  data['tanggal'],
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              data['nama_wp'],
                              style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${data['jenis']} • ${data['desa']}',
                              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                OutlinedButton(
                                  onPressed: () => _navigateToDetail(context, data),
                                  child: const Text('Detail'),
                                ),
                                const SizedBox(width: 8),
                                ElevatedButton(
                                  onPressed: () => _navigateToDetail(context, data),
                                  child: const Text('Verifikasi'),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
