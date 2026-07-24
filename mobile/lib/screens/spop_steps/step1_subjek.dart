part of '../spop_form_screen.dart';

class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    return TextEditingValue(
      text: newValue.text.toUpperCase(),
      selection: newValue.selection,
    );
  }
}

extension _Step1Extension on _SpopFormScreenState {
  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomTextField(
          controller: _namaWpController,
          label: 'Nama Wajib Pajak *',
          textCapitalization: TextCapitalization.characters,
          inputFormatters: [UpperCaseTextFormatter()],
          validator: (v) {
            if (v == null || v.isEmpty) return 'Wajib diisi';
            if (v.length < 3 || v.length > 100) return 'Nama 3-100 karakter';
            if (!RegExp(r"^[a-zA-Z\s\.,']+$").hasMatch(v)) return 'Format nama tidak valid';
            return null;
          },
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(8),
          ),
          child: CheckboxListTile(
            value: _menggunakanKuasa,
            onChanged: (val) {
              updateFormState(() {
                _menggunakanKuasa = val ?? false;
                if (!_menggunakanKuasa) {
                  _lampiran.removeWhere((l) => l['jenis_dokumen'] == 'Surat Kuasa');
                }
              });
            },
            title: const Text('Bertindak Selaku Kuasa (Bukan Pemilik Langsung)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
            controlAffinity: ListTileControlAffinity.leading,
            contentPadding: EdgeInsets.zero,
            dense: true,
          ),
        ),
        if (_menggunakanKuasa) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.blue.shade100),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Wajib Lampirkan Surat Kuasa', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.blueGrey)),
                      const SizedBox(height: 4),
                      const Text('Karena Anda bertindak selaku kuasa, silakan unggah dokumen surat kuasa di sini (Maks 2MB).', style: TextStyle(fontSize: 11, color: Colors.blueGrey)),
                      const SizedBox(height: 8),
                      if (_lampiran.any((l) => l['jenis_dokumen'] == 'Surat Kuasa'))
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(4)),
                          child: const Text('✅ Surat Kuasa Terunggah', style: TextStyle(fontSize: 11, color: Colors.green, fontWeight: FontWeight.bold)),
                        )
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                InkWell(
                  onTap: _isLoading ? null : () => _pickFile('Surat Kuasa'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.blue.shade300, style: BorderStyle.solid),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Icon(Icons.upload_file, color: Colors.blue.shade700, size: 24),
                        const SizedBox(height: 4),
                        Text('Unggah File', style: TextStyle(fontSize: 10, color: Colors.blue.shade700, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _nikController, label: 'NIK (16 digit) *', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(16), FilteringTextInputFormatter.digitsOnly], validator: (v) {
            if (v == null || v.isEmpty) return 'Wajib diisi';
            if (v.length != 16) return 'Harus 16 digit';
            return null;
          })),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _npwpController, label: 'NPWP', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(16), FilteringTextInputFormatter.digitsOnly], validator: (v) {
            if (v != null && v.isNotEmpty && v.length != 15 && v.length != 16) return 'Harus 15/16 digit';
            return null;
          })),
        ]),
        const SizedBox(height: 12),
        CustomTextField(controller: _noHpController, label: 'Nomor HP', keyboardType: TextInputType.phone, inputFormatters: [LengthLimitingTextInputFormatter(15), FilteringTextInputFormatter.digitsOnly], validator: (v) {
          if (v != null && v.isNotEmpty) {
             if (v.length < 10) return 'Minimal 10 digit';
             if (!v.startsWith('08') && !v.startsWith('62')) return 'Harus diawali 08/62';
          }
          return null;
        }),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
            child: CustomDropdown<String>(
              label: 'Status WP',
              value: _statusWp,
              items: _statusWpOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateFormState(() => _statusWp = v!),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: CustomDropdown<String>(
              label: 'Pekerjaan',
              value: _pekerjaan,
              items: _pekerjaanOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateFormState(() => _pekerjaan = v!),
            ),
          ),
        ]),
        const SizedBox(height: 12),
        CustomTextField(controller: _alamatWpController, label: 'Alamat (Jalan) *', maxLines: 2, validator: (v) {
          if (v == null || v.isEmpty) return 'Wajib diisi';
          if (v.length < 5) return 'Minimal 5 karakter';
          return null;
        }),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _rtController, label: 'RT *', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(3), FilteringTextInputFormatter.digitsOnly], validator: (v) => v == null || v.isEmpty ? 'Wajib' : null, hintText: '001')),
          const SizedBox(width: 8),
          Expanded(child: CustomTextField(controller: _rwController, label: 'RW *', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(3), FilteringTextInputFormatter.digitsOnly], validator: (v) => v == null || v.isEmpty ? 'Wajib' : null, hintText: '001')),
          const SizedBox(width: 8),
          Expanded(flex: 2, child: CustomDropdown<String>(
            label: 'Kecamatan *',
            value: _getValidKecamatan(_kecamatanWpController.text),
            items: _kecamatans.map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 14), overflow: TextOverflow.ellipsis))).toList(),
            onChanged: (v) => updateFormState(() {
              _kecamatanWpController.text = v ?? '';
              _kelurahanWpController.text = ''; // Reset
            }),
            validator: (v) => v == null || v.isEmpty ? '*' : null,
          )),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomDropdown<String>(
            label: 'Kelurahan *',
            value: _getValidKelurahan(_kecamatanWpController.text, _kelurahanWpController.text),
            items: _getValidKecamatan(_kecamatanWpController.text) != null
                ? WilayahData.data.where((e) => e['kecamatan'] == _getValidKecamatan(_kecamatanWpController.text)).map((e) => e['nama_desa']!).toSet().toList().map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 14), overflow: TextOverflow.ellipsis))).toList()
                : [],
            onChanged: (v) => updateFormState(() => _kelurahanWpController.text = v ?? ''),
            validator: (v) => v == null || v.isEmpty ? '*' : null,
          )),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _kodePosController, label: 'Kode Pos', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(5), FilteringTextInputFormatter.digitsOnly])),
        ]),
      ],
    );
  }
}
