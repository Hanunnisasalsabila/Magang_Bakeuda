part of '../spop_form_screen.dart';

extension _Step3Extension on _SpopFormScreenState {
  Widget _buildStep3Bangunan() {
    if (_dataBangunanList.isEmpty || _currentBangunanIndex > _dataBangunanList.length) return const SizedBox();
    
    final b = _dataBangunanList[_currentBangunanIndex - 1];
    void updateB(String key, dynamic value) {
      updateFormState(() => b[key] = value);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ExpansionTile(
          initiallyExpanded: true,
          title: const Text('Rincian Utama', style: TextStyle(fontWeight: FontWeight.bold)),
          childrenPadding: const EdgeInsets.all(8),
          children: [
            DropdownButtonFormField<String>(
              value: b['jenisPenggunaan'] ?? Constants.jenisPenggunaanBangunan[0],
              decoration: InputDecoration(labelText: 'Jenis Penggunaan', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.jenisPenggunaanBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('jenisPenggunaan', v),
            ),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(
                controller: TextEditingController(text: b['luasBangunan']?.toString())..selection = TextSelection.collapsed(offset: (b['luasBangunan']?.toString() ?? '').length),
                label: 'Luas (m²) *', keyboardType: TextInputType.number,
                onChanged: (v) => updateB('luasBangunan', v),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Wajib diisi';
                  if ((double.tryParse(v) ?? 0) <= 0) return 'Harus > 0';
                  return null;
                },
              )),
              const SizedBox(width: 12),
              Expanded(child: CustomTextField(
                controller: TextEditingController(text: b['jumlahLantai']?.toString())..selection = TextSelection.collapsed(offset: (b['jumlahLantai']?.toString() ?? '').length),
                label: 'Jml Lantai *', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(2), FilteringTextInputFormatter.digitsOnly],
                onChanged: (v) => updateB('jumlahLantai', v),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Wajib';
                  int j = int.tryParse(v) ?? 0;
                  if (j < 1 || j > 99) return '1-99';
                  return null;
                },
              )),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(
                controller: TextEditingController(text: b['tahunDibangun']?.toString())..selection = TextSelection.collapsed(offset: (b['tahunDibangun']?.toString() ?? '').length),
                label: 'Tahun Dibangun *', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(4), FilteringTextInputFormatter.digitsOnly],
                onChanged: (v) => updateB('tahunDibangun', v),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Wajib';
                  if (v.length != 4) return '4 digit';
                  int t = int.tryParse(v) ?? 0;
                  if (t < 1900 || t > DateTime.now().year) return 'Tdk valid';
                  return null;
                },
              )),
              Expanded(child: CustomTextField(
                controller: TextEditingController(text: b['tahunDirenovasi']?.toString())..selection = TextSelection.collapsed(offset: (b['tahunDirenovasi']?.toString() ?? '').length),
                label: 'Thn Renovasi (Ops)', keyboardType: TextInputType.number, inputFormatters: [LengthLimitingTextInputFormatter(4), FilteringTextInputFormatter.digitsOnly],
                onChanged: (v) => updateB('tahunDirenovasi', v),
                validator: (v) {
                  if (v != null && v.isNotEmpty) {
                    if (v.length != 4) return '4 digit';
                    int t = int.tryParse(v) ?? 0;
                    if (t < 1900 || t > DateTime.now().year) return 'Tdk valid';
                  }
                  return null;
                },
              )),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: CustomTextField(
                controller: TextEditingController(text: b['dayaListrik']?.toString())..selection = TextSelection.collapsed(offset: (b['dayaListrik']?.toString() ?? '').length),
                label: 'Daya Listrik (W) *', keyboardType: TextInputType.number, inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                onChanged: (v) => updateB('dayaListrik', v),
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Wajib (isi 0 jika tdk ada)';
                  return null;
                },
              )),
              const SizedBox(width: 12),
              Expanded(child: DropdownButtonFormField<String>(
                value: b['kondisi'] ?? Constants.kondisiBangunan[0],
                decoration: InputDecoration(labelText: 'Kondisi', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: Constants.kondisiBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('kondisi', v),
              )),
            ]),
          ],
        ),
        ExpansionTile(
          initiallyExpanded: false,
          title: const Text('Spesifikasi Material', style: TextStyle(fontWeight: FontWeight.bold)),
          childrenPadding: const EdgeInsets.all(8),
          children: [
            DropdownButtonFormField<String>(
              value: b['konstruksi'] ?? Constants.konstruksiBangunan[0],
              decoration: InputDecoration(labelText: 'Konstruksi', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.konstruksiBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('konstruksi', v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: b['atap'] ?? Constants.atapBangunan[0],
              decoration: InputDecoration(labelText: 'Atap', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.atapBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('atap', v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: b['dinding'] ?? Constants.dindingBangunan[0],
              decoration: InputDecoration(labelText: 'Dinding', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.dindingBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('dinding', v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: b['lantai'] ?? Constants.lantaiBangunan[0],
              decoration: InputDecoration(labelText: 'Lantai', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.lantaiBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('lantai', v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: b['langitLangit'] ?? Constants.langitLangitBangunan[0],
              decoration: InputDecoration(labelText: 'Langit-langit', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: Constants.langitLangitBangunan.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => updateB('langitLangit', v),
            ),
          ],
        ),
        ExpansionTile(
          initiallyExpanded: false,
          title: const Text('Fasilitas (Opsional)', style: TextStyle(fontWeight: FontWeight.bold)),
          childrenPadding: const EdgeInsets.all(8),
          children: [
            SwitchListTile(
              title: const Text('Pendingin Ruangan (AC)'),
              subtitle: const Text('AC Split, Window, atau Sentral', style: TextStyle(fontSize: 12)),
              value: b['hasAC'] == true,
              onChanged: (v) => updateB('hasAC', v),
            ),
            if (b['hasAC'] == true) ...[
              Row(children: [
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['acSplit']?.toString())..selection = TextSelection.collapsed(offset: (b['acSplit']?.toString() ?? '').length),
                  label: 'Jml AC Split', keyboardType: TextInputType.number, onChanged: (v) => updateB('acSplit', v),
                )),
                const SizedBox(width: 12),
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['acWindow']?.toString())..selection = TextSelection.collapsed(offset: (b['acWindow']?.toString() ?? '').length),
                  label: 'Jml AC Window', keyboardType: TextInputType.number, onChanged: (v) => updateB('acWindow', v),
                )),
              ]),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: b['acSentral']?.toString() ?? 'Tidak Ada',
                decoration: InputDecoration(labelText: 'AC Sentral', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Ada', 'Tidak Ada'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('acSentral', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Kolam Renang'),
              value: b['hasKolamRenang'] == true,
              onChanged: (v) => updateB('hasKolamRenang', v),
            ),
            if (b['hasKolamRenang'] == true) ...[
              CustomTextField(
                controller: TextEditingController(text: b['kolamRenangLuas']?.toString())..selection = TextSelection.collapsed(offset: (b['kolamRenangLuas']?.toString() ?? '').length),
                label: 'Luas Kolam (M²)', keyboardType: TextInputType.number, onChanged: (v) => updateB('kolamRenangLuas', v),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: b['kolamRenangFinishing']?.toString(),
                decoration: InputDecoration(labelText: 'Finishing', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Diplester', 'Dengan Pelapis'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('kolamRenangFinishing', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Pagar Halaman'),
              value: b['hasPagar'] == true,
              onChanged: (v) => updateB('hasPagar', v),
            ),
            if (b['hasPagar'] == true) ...[
              CustomTextField(
                controller: TextEditingController(text: b['panjangPagar']?.toString())..selection = TextSelection.collapsed(offset: (b['panjangPagar']?.toString() ?? '').length),
                label: 'Panjang Pagar (M)', keyboardType: TextInputType.number, onChanged: (v) => updateB('panjangPagar', v),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: b['bahanPagar']?.toString(),
                decoration: InputDecoration(labelText: 'Bahan Pagar', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Baja/Besi', 'Bata/Batako'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('bahanPagar', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Perkerasan Halaman'),
              value: b['hasHalaman'] == true,
              onChanged: (v) => updateB('hasHalaman', v),
            ),
            if (b['hasHalaman'] == true) ...[
              CustomTextField(
                controller: TextEditingController(text: b['halamanRingan']?.toString())..selection = TextSelection.collapsed(offset: (b['halamanRingan']?.toString() ?? '').length),
                label: 'Halaman Ringan (M²)', keyboardType: TextInputType.number, onChanged: (v) => updateB('halamanRingan', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['halamanSedang']?.toString())..selection = TextSelection.collapsed(offset: (b['halamanSedang']?.toString() ?? '').length),
                label: 'Halaman Sedang (M²)', keyboardType: TextInputType.number, onChanged: (v) => updateB('halamanSedang', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['halamanBerat']?.toString())..selection = TextSelection.collapsed(offset: (b['halamanBerat']?.toString() ?? '').length),
                label: 'Halaman Berat (M²)', keyboardType: TextInputType.number, onChanged: (v) => updateB('halamanBerat', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['halamanPenutupLantai']?.toString())..selection = TextSelection.collapsed(offset: (b['halamanPenutupLantai']?.toString() ?? '').length),
                label: 'Dgn Penutup Lantai (M²)', keyboardType: TextInputType.number, onChanged: (v) => updateB('halamanPenutupLantai', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Lift / Eskalator'),
              value: b['hasLift'] == true,
              onChanged: (v) => updateB('hasLift', v),
            ),
            if (b['hasLift'] == true) ...[
              CustomTextField(
                controller: TextEditingController(text: b['liftPenumpang']?.toString())..selection = TextSelection.collapsed(offset: (b['liftPenumpang']?.toString() ?? '').length),
                label: 'Lift Penumpang (Unit)', keyboardType: TextInputType.number, onChanged: (v) => updateB('liftPenumpang', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['liftKapsul']?.toString())..selection = TextSelection.collapsed(offset: (b['liftKapsul']?.toString() ?? '').length),
                label: 'Lift Kapsul (Unit)', keyboardType: TextInputType.number, onChanged: (v) => updateB('liftKapsul', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['liftBarang']?.toString())..selection = TextSelection.collapsed(offset: (b['liftBarang']?.toString() ?? '').length),
                label: 'Lift Barang (Unit)', keyboardType: TextInputType.number, onChanged: (v) => updateB('liftBarang', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['tanggaBerjalanKecil']?.toString())..selection = TextSelection.collapsed(offset: (b['tanggaBerjalanKecil']?.toString() ?? '').length),
                label: 'Eskalator < 0.8m (Unit)', keyboardType: TextInputType.number, onChanged: (v) => updateB('tanggaBerjalanKecil', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['tanggaBerjalanBesar']?.toString())..selection = TextSelection.collapsed(offset: (b['tanggaBerjalanBesar']?.toString() ?? '').length),
                label: 'Eskalator > 0.8m (Unit)', keyboardType: TextInputType.number, onChanged: (v) => updateB('tanggaBerjalanBesar', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Pemadam Kebakaran'),
              value: b['hasPemadam'] == true,
              onChanged: (v) => updateB('hasPemadam', v),
            ),
            if (b['hasPemadam'] == true) ...[
              DropdownButtonFormField<String>(
                value: b['pemadamHydrant']?.toString() ?? 'Tidak Ada',
                decoration: InputDecoration(labelText: 'Hydrant', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Ada', 'Tidak Ada'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('pemadamHydrant', v),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: b['pemadamSprinkler']?.toString() ?? 'Tidak Ada',
                decoration: InputDecoration(labelText: 'Sprinkler', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Ada', 'Tidak Ada'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('pemadamSprinkler', v),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: b['pemadamFireAl']?.toString() ?? 'Tidak Ada',
                decoration: InputDecoration(labelText: 'Fire Alarm', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
                items: ['Ada', 'Tidak Ada'].map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (v) => updateB('pemadamFireAl', v),
              ),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Lapangan Tenis'),
              value: b['hasTenis'] == true,
              onChanged: (v) => updateB('hasTenis', v),
            ),
            if (b['hasTenis'] == true) ...[
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: Text('Dengan Lampu (Jml Lapangan)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              Row(children: [
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisLampuBeton']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisLampuBeton']?.toString() ?? '').length),
                  label: 'Beton', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisLampuBeton', v),
                )),
                const SizedBox(width: 8),
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisLampuAspal']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisLampuAspal']?.toString() ?? '').length),
                  label: 'Aspal', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisLampuAspal', v),
                )),
                const SizedBox(width: 8),
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisLampuTanah']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisLampuTanah']?.toString() ?? '').length),
                  label: 'Tanah/Rumput', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisLampuTanah', v),
                )),
              ]),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: Text('Tanpa Lampu (Jml Lapangan)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              Row(children: [
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisTanpaLampuBeton']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisTanpaLampuBeton']?.toString() ?? '').length),
                  label: 'Beton', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisTanpaLampuBeton', v),
                )),
                const SizedBox(width: 8),
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisTanpaLampuAspal']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisTanpaLampuAspal']?.toString() ?? '').length),
                  label: 'Aspal', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisTanpaLampuAspal', v),
                )),
                const SizedBox(width: 8),
                Expanded(child: CustomTextField(
                  controller: TextEditingController(text: b['lapanganTenisTanpaLampuTanah']?.toString())..selection = TextSelection.collapsed(offset: (b['lapanganTenisTanpaLampuTanah']?.toString() ?? '').length),
                  label: 'Tanah/Rumput', keyboardType: TextInputType.number, onChanged: (v) => updateB('lapanganTenisTanpaLampuTanah', v),
                )),
              ]),
              const Divider(),
            ],
            SwitchListTile(
              title: const Text('Saluran PABX & Sumur Artesis'),
              value: b['hasLain'] == true,
              onChanged: (v) => updateB('hasLain', v),
            ),
            if (b['hasLain'] == true) ...[
              CustomTextField(
                controller: TextEditingController(text: b['saluranPabx']?.toString())..selection = TextSelection.collapsed(offset: (b['saluranPabx']?.toString() ?? '').length),
                label: 'Jml Saluran PABX', keyboardType: TextInputType.number, onChanged: (v) => updateB('saluranPabx', v),
              ),
              const SizedBox(height: 12),
              CustomTextField(
                controller: TextEditingController(text: b['sumurArtesis']?.toString())..selection = TextSelection.collapsed(offset: (b['sumurArtesis']?.toString() ?? '').length),
                label: 'Kdlmn Sumur Artesis (M)', keyboardType: TextInputType.number, onChanged: (v) => updateB('sumurArtesis', v),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
