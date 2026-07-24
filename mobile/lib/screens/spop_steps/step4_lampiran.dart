part of '../spop_form_screen.dart';

extension _Step4Extension on _SpopFormScreenState {
  Widget _buildStep4() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Unggah dokumen pendukung (KTP, Sertifikat Tanah, dll)', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
        const SizedBox(height: 12),
        ..._lampiran.map((l) => ListTile(
          dense: true,
          contentPadding: EdgeInsets.zero,
          leading: const Icon(Icons.file_present, color: Colors.green),
          title: Text(l['jenis_dokumen'] ?? '-', style: const TextStyle(fontSize: 13)),
          trailing: IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.red),
            onPressed: () => updateFormState(() => _lampiran.remove(l)),
          ),
        )),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _selectedJenisDokumen,
          decoration: InputDecoration(
            labelText: 'Jenis Dokumen',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          ),
          items: ['KTP', 'Sertifikat Hak Milik', 'Akte Jual Beli', 'Izin Mendirikan Bangunan', 'Dokumen Pendukung Lokasi']
              .map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14))))
              .toList(),
          onChanged: (v) {
            if (v != null) {
              updateFormState(() => _selectedJenisDokumen = v);
            }
          },
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: _isLoading ? null : _pickFile,
            icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.upload_file),
            label: Text(_isLoading ? 'Mengunggah...' : 'Pilih & Unggah Berkas'),
          ),
        ),
      ],
    );
  }
}
