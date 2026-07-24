part of '../spop_form_screen.dart';

extension _Step1Extension on _SpopFormScreenState {
  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomTextField(controller: _namaWpController, label: 'Nama Wajib Pajak *', validator: (v) {
          if (v == null || v.isEmpty) return 'Wajib diisi';
          if (v.length < 3 || v.length > 100) return 'Nama 3-100 karakter';
          if (!RegExp(r"^[a-zA-Z\s\.,']+$").hasMatch(v)) return 'Format nama tidak valid';
          return null;
        }),
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
            child: DropdownButtonFormField<String>(
              value: _statusWp,
              isExpanded: true,
              decoration: InputDecoration(labelText: 'Status WP', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: _statusWpOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateFormState(() => _statusWp = v!),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _pekerjaan,
              isExpanded: true,
              decoration: InputDecoration(labelText: 'Pekerjaan', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
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
          Expanded(flex: 2, child: DropdownButtonFormField<String>(
            value: _getValidKecamatan(_kecamatanWpController.text),
            isExpanded: true,
            decoration: InputDecoration(labelText: 'Kecamatan *', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.grey))),
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
          Expanded(child: DropdownButtonFormField<String>(
            value: _getValidKelurahan(_kecamatanWpController.text, _kelurahanWpController.text),
            isExpanded: true,
            decoration: InputDecoration(labelText: 'Kelurahan *', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.grey))),
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
