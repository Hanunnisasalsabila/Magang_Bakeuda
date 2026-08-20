part of '../spop_form_screen.dart';

extension _Step5Extension on _SpopFormScreenState {
  Widget _buildStep5() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Text(
              'RESI PENGAJUAN SPOP',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: const Color(0xFF0F2C59)),
            ),
          ),
          const Divider(thickness: 1, height: 24),
          _buildResiRow('Jenis Layanan', _jenisLayanan),
          _buildResiRow('Kategori', _selectedKategori),
          if (_nopUtamaController.text.isNotEmpty) _buildResiRow('NOP Utama', _nopUtamaController.text),
          if (_nopAsalControllers.any((c) => c.text.isNotEmpty)) _buildResiRow('NOP Asal', _nopAsalControllers.map((c) => c.text).where((t) => t.isNotEmpty).join(', ')),
          if (_alasanHapusController.text.isNotEmpty) _buildResiRow('Alasan Hapus', _alasanHapusController.text),
          if (_jenisLayanan == 'PECAH') ...[
            const Divider(height: 24),
            const Text('Data Pecahan:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
            const SizedBox(height: 8),
            ..._pecahanList.asMap().entries.map((e) {
              final idx = e.key + 1;
              final p = e.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Pecahan $idx', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F2C59))),
                    const SizedBox(height: 8),
                    _buildResiRow('Wajib Pajak', p['namaWp']?.toString() ?? ''),
                    _buildResiRow('NIK', p['nik']?.toString() ?? ''),
                    _buildResiRow('Alamat WP', p['alamatWp']?.toString() ?? ''),
                    _buildResiRow('Letak OP', p['jalanOp']?.toString() ?? ''),
                    _buildResiRow('Luas Tanah', '${p['luasTanah']?.toString() ?? '0'} m²'),
                  ],
                ),
              );
            }),
          ] else ...[
            const Divider(height: 24),
            const Text('Data Subjek & Objek Pajak:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildResiRow('Wajib Pajak', _namaWpController.text),
                  _buildResiRow('NIK', _nikController.text),
                  _buildResiRow('Alamat WP', _alamatWpController.text),
                  _buildResiRow('Letak OP', _jalanOpController.text),
                  _buildResiRow('Luas Tanah', '${_luasTanahController.text.isEmpty ? '0' : _luasTanahController.text} m²'),
                ],
              ),
            ),
          ],
          const Divider(height: 24),
          const Text('Lampiran Terunggah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 8),
          if (_jenisLayanan != 'PECAH') ...[
            if (_lampiran.isEmpty) const Text('- Belum ada lampiran', style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic)),
            ..._lampiran.map((l) => Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.green, size: 16),
                const SizedBox(width: 8),
                Expanded(child: Text(l['jenis_dokumen'] ?? '-', style: const TextStyle(fontSize: 13))),
              ],
            )),
          ] else ...[
            if (_pecahanList.every((p) => (p['lampiran'] as List? ?? []).isEmpty))
               const Text('- Belum ada lampiran', style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic)),
            ..._pecahanList.asMap().entries.map((e) {
               final idx = e.key + 1;
               final lamps = e.value['lampiran'] as List? ?? [];
               if (lamps.isEmpty) return const SizedBox();
               return Padding(
                 padding: const EdgeInsets.only(bottom: 8),
                 child: Column(
                   crossAxisAlignment: CrossAxisAlignment.start,
                   children: [
                     Text('Pecahan $idx:', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                     ...lamps.map((l) => Row(
                       children: [
                         const Icon(Icons.check_circle, color: Colors.green, size: 14),
                         const SizedBox(width: 8),
                         Expanded(child: Text(l['jenis_dokumen'] ?? '-', style: const TextStyle(fontSize: 12))),
                       ],
                     )),
                   ],
                 ),
               );
            }),
          ],
        ],
      ),
    );
  }

  Widget _buildResiRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(flex: 2, child: Text(label, style: const TextStyle(fontSize: 13, color: Colors.grey))),
          const Text(': ', style: TextStyle(fontSize: 13, color: Colors.grey)),
          Expanded(flex: 3, child: Text(value.isEmpty ? '-' : value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold))),
        ],
      ),
    );
  }
}
