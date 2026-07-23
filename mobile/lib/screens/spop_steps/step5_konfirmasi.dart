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
          if (_selectedKategori != 'PENGHAPUSAN') ...[
            const Divider(height: 24),
            _buildResiRow('Wajib Pajak', _namaWpController.text),
            _buildResiRow('NIK', _nikController.text),
            _buildResiRow('Alamat WP', _alamatWpController.text),
          ],
          const Divider(height: 24),
          const Text('Lampiran Terunggah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 8),
          if (_lampiran.isEmpty) const Text('- Belum ada lampiran', style: TextStyle(fontSize: 13, fontStyle: FontStyle.italic)),
          ..._lampiran.map((l) => Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 16),
              const SizedBox(width: 8),
              Expanded(child: Text(l['jenis_dokumen'] ?? '-', style: const TextStyle(fontSize: 13))),
            ],
          )),
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
