import 'package:flutter/material.dart';

class PelacakanDokumenScreen extends StatefulWidget {
  const PelacakanDokumenScreen({super.key});

  @override
  State<PelacakanDokumenScreen> createState() => _PelacakanDokumenScreenState();
}

class _PelacakanDokumenScreenState extends State<PelacakanDokumenScreen> {
  final List<Map<String, dynamic>> _dummyData = [
    {
      'nop': '33.03.010.001.001-0001.0',
      'jenis': 'Pendaftaran Baru',
      'status_terkini': 'Sedang Direview',
      'timeline': [
        {'status': 'Disubmit oleh Desa', 'tanggal': '12 Jul 2026, 09:00', 'isCompleted': true},
        {'status': 'Direview Admin BKD', 'tanggal': '13 Jul 2026, 14:30', 'isCompleted': true},
        {'status': 'Menunggu Verifikasi Lapangan', 'tanggal': '-', 'isCompleted': false},
        {'status': 'Disetujui', 'tanggal': '-', 'isCompleted': false},
      ],
    },
    {
      'nop': '33.03.010.001.001-0002.0',
      'jenis': 'Mutasi Penuh',
      'status_terkini': 'Selesai / Disetujui',
      'timeline': [
        {'status': 'Disubmit oleh Desa', 'tanggal': '01 Jul 2026, 10:00', 'isCompleted': true},
        {'status': 'Direview Admin BKD', 'tanggal': '02 Jul 2026, 11:00', 'isCompleted': true},
        {'status': 'Menunggu Verifikasi Lapangan', 'tanggal': '05 Jul 2026, 09:00', 'isCompleted': true},
        {'status': 'Disetujui', 'tanggal': '06 Jul 2026, 15:00', 'isCompleted': true},
      ],
    },
  ];

  void _showTimelineDialog(BuildContext context, Map<String, dynamic> data) {
    final theme = Theme.of(context);
    final List timeline = data['timeline'];

    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Riwayat Status',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                ),
                const SizedBox(height: 8),
                Text('NOP: ${data['nop']}'),
                const Divider(height: 24),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: timeline.length,
                  itemBuilder: (context, index) {
                    final item = timeline[index];
                    final isCompleted = item['isCompleted'] == true;
                    final isLast = index == timeline.length - 1;

                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          children: [
                            Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isCompleted ? theme.colorScheme.primary : theme.colorScheme.surfaceVariant,
                                border: Border.all(
                                  color: isCompleted ? theme.colorScheme.primary : theme.colorScheme.outline,
                                ),
                              ),
                              child: isCompleted
                                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                                  : null,
                            ),
                            if (!isLast)
                              Container(
                                width: 2,
                                height: 40,
                                color: isCompleted ? theme.colorScheme.primary : theme.colorScheme.surfaceVariant,
                              ),
                          ],
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item['status'],
                                style: TextStyle(
                                  fontWeight: isCompleted ? FontWeight.bold : FontWeight.normal,
                                  color: isCompleted ? theme.colorScheme.onSurface : theme.colorScheme.onSurfaceVariant,
                                ),
                              ),
                              if (item['tanggal'] != '-')
                                Text(
                                  item['tanggal'],
                                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                                ),
                              const SizedBox(height: 16),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Tutup'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pelacakan Dokumen'),
        backgroundColor: theme.colorScheme.background,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _dummyData.length,
        itemBuilder: (context, index) {
          final data = _dummyData[index];
          
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
            color: theme.colorScheme.surface,
            child: InkWell(
              onTap: () => _showTimelineDialog(context, data),
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          data['jenis'],
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primaryContainer,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            data['status_terkini'],
                            style: TextStyle(
                              color: theme.colorScheme.onPrimaryContainer,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'NOP: ${data['nop']}',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Icon(Icons.touch_app_outlined, size: 16, color: theme.colorScheme.onSurfaceVariant),
                        const SizedBox(width: 4),
                        Text(
                          'Ketuk untuk melihat riwayat perjalanan',
                          style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
