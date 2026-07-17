import 'package:flutter/material.dart';

class AkunDesaScreen extends StatelessWidget {
  const AkunDesaScreen({super.key});

  final List<Map<String, String>> _daftarDesa = const [
    {'nama': 'Desa Bojanegara', 'kecamatan': 'Padamara', 'status': 'Aktif'},
    {'nama': 'Desa Karangbanjar', 'kecamatan': 'Bojongsari', 'status': 'Aktif'},
    {'nama': 'Desa Kutasari', 'kecamatan': 'Kutasari', 'status': 'Aktif'},
    {'nama': 'Desa Mewek', 'kecamatan': 'Kalimanah', 'status': 'Tidak Aktif'},
    {'nama': 'Desa Purbalingga Lor', 'kecamatan': 'Purbalingga', 'status': 'Aktif'},
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manajemen Akun Desa'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _daftarDesa.length,
        itemBuilder: (context, index) {
          final desa = _daftarDesa[index];
          final bool isAktif = desa['status'] == 'Aktif';

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: theme.colorScheme.outline.withValues(alpha: 0.2)),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: CircleAvatar(
                backgroundColor: isAktif ? theme.colorScheme.primaryContainer : theme.colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.holiday_village_outlined,
                  color: isAktif ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant,
                ),
              ),
              title: Text(desa['nama']!, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Kecamatan ${desa['kecamatan']}'),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isAktif ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  desa['status']!,
                  style: TextStyle(
                    color: isAktif ? Colors.green : Colors.red,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              onTap: () {
                // Navigate to detail or edit
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Add new account
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
