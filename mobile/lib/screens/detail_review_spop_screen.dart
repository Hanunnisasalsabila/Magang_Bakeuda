import 'package:flutter/material.dart';

class DetailReviewSpopScreen extends StatefulWidget {
  final Map<String, dynamic> data;

  const DetailReviewSpopScreen({super.key, required this.data});

  @override
  State<DetailReviewSpopScreen> createState() => _DetailReviewSpopScreenState();
}

class _DetailReviewSpopScreenState extends State<DetailReviewSpopScreen> {
  void _tampilkanDialogPenolakan(BuildContext context) {
    final catatanController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Tolak Pengajuan'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Berikan alasan penolakan agar Perangkat Desa dapat memperbaikinya:'),
              const SizedBox(height: 12),
              TextField(
                controller: catatanController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Misal: Bukti kepemilikan tidak sesuai...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Batal'),
            ),
            ElevatedButton(
              onPressed: () {
                // Proses tolak
                Navigator.pop(context); // Tutup dialog
                Navigator.pop(context, false); // Tutup halaman dengan result false (ditolak)
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).colorScheme.error,
                foregroundColor: Theme.of(context).colorScheme.onError,
              ),
              child: const Text('Kirim Penolakan'),
            ),
          ],
        );
      },
    );
  }

  void _prosesSetujui(BuildContext context) {
    // Proses setujui
    Navigator.pop(context, true); // Tutup halaman dengan result true (disetujui)
  }

  Widget _buildSectionInfo(String title, Map<String, String> items, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.primary,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2)),
          ),
          child: Column(
            children: items.entries.map((entry) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 2,
                      child: Text(
                        entry.key,
                        style: TextStyle(color: theme.colorScheme.onSurfaceVariant),
                      ),
                    ),
                    const Text(' : '),
                    Expanded(
                      flex: 3,
                      child: Text(
                        entry.value,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final data = widget.data;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detail Review SPOP'),
        backgroundColor: theme.colorScheme.background,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.secondaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.assignment_ind_outlined, color: theme.colorScheme.onSecondaryContainer, size: 32),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('ID Pengajuan: ${data['id']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                        Text('Tanggal: ${data['tanggal']}', style: theme.textTheme.bodySmall),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            _buildSectionInfo('1. Data Umum', {
              'Jenis Pengajuan': data['jenis'] ?? '-',
              'Desa/Kelurahan': data['desa'] ?? '-',
            }, theme),

            _buildSectionInfo('2. Data Wajib Pajak', {
              'Nama WP': data['nama_wp'] ?? '-',
              'NIK': '3303000000000000', // Dummy
              'Alamat WP': 'Jl. Contoh Alamat WP, RT 01 RW 02', // Dummy
            }, theme),

            _buildSectionInfo('3. Data Objek Pajak', {
              'NOP': '33.03.010.001.001-0001.0', // Dummy
              'Alamat OP': 'Jl. Contoh Alamat OP, Blok A', // Dummy
              'Luas Tanah': '120 m²', // Dummy
              'Luas Bangunan': '80 m²', // Dummy
            }, theme),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _tampilkanDialogPenolakan(context),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: theme.colorScheme.error,
                    side: BorderSide(color: theme.colorScheme.error),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Tolak'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _prosesSetujui(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: theme.colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Setujui'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
