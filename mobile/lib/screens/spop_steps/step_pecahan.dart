part of '../spop_form_screen.dart';

extension _StepPecahanExtension on _SpopFormScreenState {
  // ───────────────────────────────────────────────
  // Accessors
  // ───────────────────────────────────────────────
  Map<String, dynamic> get _cp => _pecahanList[_currentPecahanIdx - 1];

  void _setP(String key, dynamic value) =>
      updateFormState(() => _pecahanList[_currentPecahanIdx - 1][key] = value);

  void _setB(String key, dynamic value) => updateFormState(() =>
      (_pecahanList[_currentPecahanIdx - 1]['dataBangunan'] as List)[
          _currentPecahanBangunanIdx - 1][key] = value);

  // ───────────────────────────────────────────────
  // Top-level router
  // ───────────────────────────────────────────────
  Widget _buildPecahanStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildPecahanProgressHeader(),
        const SizedBox(height: 16),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 220),
          child: KeyedSubtree(
            key: ValueKey('$_currentPecahanIdx-$_pecahanSubStep-$_currentPecahanBangunanIdx'),
            child: _buildPecahanSubStepContent(),
          ),
        ),
      ],
    );
  }

  Widget _buildPecahanProgressHeader() {
    const subStepNames = ['Subjek Pajak', 'Objek Tanah', 'Data Bangunan', 'Lampiran'];
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F2C59), Color(0xFF1565C0)],
        ),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(
            'PECAHAN $_currentPecahanIdx DARI $_jumlahPecahan',
            style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 1),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(20)),
            child: Text(
              subStepNames[_pecahanSubStep.clamp(0, 3)],
              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
        ]),
        const SizedBox(height: 8),
        // Sub-step bar
        Row(children: List.generate(4, (i) => Expanded(
          child: Container(
            height: 4,
            margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
            decoration: BoxDecoration(
              color: i <= _pecahanSubStep ? Colors.white : Colors.white30,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ))),
        const SizedBox(height: 8),
        // Pecahan dot progress
        Row(children: List.generate(_jumlahPecahan, (i) => Padding(
          padding: const EdgeInsets.only(right: 5),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: i == _currentPecahanIdx - 1 ? 20 : 8,
            height: 8,
            decoration: BoxDecoration(
              color: i < _currentPecahanIdx - 1 ? Colors.greenAccent
                   : i == _currentPecahanIdx - 1 ? Colors.white
                   : Colors.white30,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ))),
      ]),
    );
  }

  Widget _buildPecahanSubStepContent() {
    switch (_pecahanSubStep) {
      case 0: return _buildPecahanSubjek();
      case 1: return _buildPecahanObjek();
      case 2: return _buildPecahanBangunan();
      case 3: return _buildPecahanLampiran();
      default: return const SizedBox();
    }
  }

  // ───────────────────────────────────────────────
  // Sub-step 0: Subjek Pajak
  // ───────────────────────────────────────────────
  Widget _buildPecahanSubjek() {
    final p = _cp;
    final kec = p['kecamatan'] as String;
    final kelurahans = kec.isEmpty
        ? <String>[]
        : WilayahData.data.where((e) => e['kecamatan'] == kec).map((e) => e['nama_desa']!).toList()..sort();

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _sectionTitle('Data Subjek Pajak'),
      const SizedBox(height: 12),
      TextFormField(
        key: ValueKey('namaWp_${_currentPecahanIdx}_${p['namaWp']}'),
        initialValue: p['namaWp'] as String,
        decoration: _dec('Nama Lengkap WP *'),
        onChanged: (v) => _setP('namaWp', v),
        validator: (v) => (v?.isEmpty ?? true) ? 'Wajib diisi' : null,
      ),
      const SizedBox(height: 12),
      Row(children: [
        Expanded(child: TextFormField(
          key: ValueKey('nik_${_currentPecahanIdx}'),
          initialValue: p['nik'] as String,
          decoration: _dec('NIK (16 digit) *'),
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(16)],
          onChanged: (v) => _setP('nik', v),
          validator: (v) => (v?.isEmpty ?? true) ? 'Wajib' : null,
        )),
        const SizedBox(width: 12),
        Expanded(child: TextFormField(
          key: ValueKey('npwp_${_currentPecahanIdx}'),
          initialValue: p['npwp'] as String,
          decoration: _dec('NPWP (Opsional)'),
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          onChanged: (v) => _setP('npwp', v),
        )),
      ]),
      const SizedBox(height: 12),
      Row(children: [
        Expanded(child: DropdownButtonFormField<String>(
      isExpanded: true,
          key: ValueKey('statusWp_${_currentPecahanIdx}'),
          initialValue: p['statusWp'] as String,
          decoration: _dec('Status WP'),
          items: _statusWpOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 13)))).toList(),
          onChanged: (v) => _setP('statusWp', v),
        )),
        const SizedBox(width: 12),
        Expanded(child: DropdownButtonFormField<String>(
      isExpanded: true,
          key: ValueKey('pekerjaan_${_currentPecahanIdx}'),
          initialValue: p['pekerjaan'] as String,
          decoration: _dec('Pekerjaan'),
          items: _pekerjaanOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 13)))).toList(),
          onChanged: (v) => _setP('pekerjaan', v),
        )),
      ]),
      const SizedBox(height: 12),
      TextFormField(
        key: ValueKey('noHp_${_currentPecahanIdx}'),
        initialValue: p['noHp'] as String,
        decoration: _dec('No. Telepon (Opsional)'),
        keyboardType: TextInputType.phone,
        onChanged: (v) => _setP('noHp', v),
      ),
      const SizedBox(height: 16),
      _sectionSubtitle('Alamat Wajib Pajak'),
      const SizedBox(height: 12),
      TextFormField(
        key: ValueKey('alamatWp_${_currentPecahanIdx}'),
        initialValue: p['alamatWp'] as String,
        decoration: _dec('Alamat Jalan *'),
        onChanged: (v) => _setP('alamatWp', v),
        validator: (v) => (v?.isEmpty ?? true) ? 'Wajib diisi' : null,
      ),
      const SizedBox(height: 12),
      Row(children: [
        Expanded(child: TextFormField(key: ValueKey('rt_${_currentPecahanIdx}'), initialValue: p['rt'] as String, decoration: _dec('RT'), keyboardType: TextInputType.number, onChanged: (v) => _setP('rt', v))),
        const SizedBox(width: 8),
        Expanded(child: TextFormField(key: ValueKey('rw_${_currentPecahanIdx}'), initialValue: p['rw'] as String, decoration: _dec('RW'), keyboardType: TextInputType.number, onChanged: (v) => _setP('rw', v))),
        const SizedBox(width: 8),
        Expanded(child: TextFormField(key: ValueKey('kodePos_${_currentPecahanIdx}'), initialValue: p['kodePos'] as String, decoration: _dec('Kode Pos'), keyboardType: TextInputType.number, inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(5)], onChanged: (v) => _setP('kodePos', v))),
      ]),
      const SizedBox(height: 12),
      DropdownButtonFormField<String>(
      isExpanded: true,
        key: ValueKey('kec_${_currentPecahanIdx}'),
        initialValue: _kecamatans.contains(kec) ? kec : null,
        decoration: _dec('Kecamatan *'),
        items: _kecamatans.map((k) => DropdownMenuItem(value: k, child: Text(k, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: (v) { _setP('kecamatan', v ?? ''); _setP('kelurahan', ''); },
        validator: (v) => (v == null || v.isEmpty) ? 'Wajib' : null,
      ),
      const SizedBox(height: 12),
      DropdownButtonFormField<String>(
      isExpanded: true,
        key: ValueKey('kel_wp_${_currentPecahanIdx}_$kec'),
        initialValue: kelurahans.contains(p['kelurahan'] as String) ? p['kelurahan'] as String : null,
        decoration: _dec('Kelurahan/Desa *'),
        items: kelurahans.map((k) => DropdownMenuItem(value: k, child: Text(k, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: (v) => _setP('kelurahan', v ?? ''),
        validator: (v) => (v == null || v.isEmpty) ? 'Wajib' : null,
      ),
      const SizedBox(height: 12),
      TextFormField(
        initialValue: p['kabupaten'] as String,
        decoration: _dec('Kabupaten'),
        readOnly: true,
      ),
    ]);
  }

  // ───────────────────────────────────────────────
  // Sub-step 1: Objek Pajak
  // ───────────────────────────────────────────────
  Widget _buildPecahanObjek() {
    final p = _cp;
    final kecOp = p['kecamatanOp'] as String;
    final kelurahansOp = kecOp.isEmpty
        ? <String>[]
        : WilayahData.data.where((e) => e['kecamatan'] == kecOp).map((e) => e['nama_desa']!).toList()..sort();

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _sectionTitle('Data Objek Pajak'),
      const SizedBox(height: 12),
      // Luas & Jenis
      Row(children: [
        Expanded(child: TextFormField(
          key: ValueKey('luasTanah_${_currentPecahanIdx}'),
          initialValue: p['luasTanah'] as String,
          decoration: _dec('Luas Tanah (m²) *'),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          onChanged: (v) => _setP('luasTanah', v),
          validator: (v) {
            if (v == null || v.isEmpty) return 'Wajib';
            if ((double.tryParse(v) ?? 0) <= 0) return 'Harus > 0';
            return null;
          },
        )),
        const SizedBox(width: 12),
        Expanded(child: DropdownButtonFormField<String>(
      isExpanded: true,
          key: ValueKey('jenisTanah_${_currentPecahanIdx}'),
          initialValue: p['jenisTanah'] as String,
          decoration: _dec('Jenis Tanah'),
          items: _jenisTanahOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 12)))).toList(),
          onChanged: (v) {
            _setP('jenisTanah', v);
            if (v == 'TANAH_KOSONG') {
              _setP('jumlahBangunan', '0');
            } else if (p['jumlahBangunan'] == '0' || p['jumlahBangunan'] == '') {
              _setP('jumlahBangunan', '1');
            }
          },
        )),
      ]),
      const SizedBox(height: 12),
      TextFormField(
        key: ValueKey('jalanOp_${_currentPecahanIdx}'),
        initialValue: p['jalanOp'] as String,
        decoration: _dec('Alamat Jalan Objek *'),
        onChanged: (v) => _setP('jalanOp', v),
        validator: (v) => (v?.isEmpty ?? true) ? 'Wajib diisi' : null,
      ),
      const SizedBox(height: 12),
      Row(children: [
        Expanded(child: TextFormField(key: ValueKey('blokKav_${_currentPecahanIdx}'), initialValue: p['blokKav'] as String, decoration: _dec('Blok/Kav'), onChanged: (v) => _setP('blokKav', v))),
        const SizedBox(width: 8),
        Expanded(child: TextFormField(key: ValueKey('rtOp_${_currentPecahanIdx}'), initialValue: p['rtOp'] as String, decoration: _dec('RT'), keyboardType: TextInputType.number, onChanged: (v) => _setP('rtOp', v))),
        const SizedBox(width: 8),
        Expanded(child: TextFormField(key: ValueKey('rwOp_${_currentPecahanIdx}'), initialValue: p['rwOp'] as String, decoration: _dec('RW'), keyboardType: TextInputType.number, onChanged: (v) => _setP('rwOp', v))),
      ]),
      const SizedBox(height: 12),
      DropdownButtonFormField<String>(
      isExpanded: true,
        key: ValueKey('kecOp_${_currentPecahanIdx}'),
        initialValue: _kecamatans.contains(kecOp) ? kecOp : null,
        decoration: _dec('Kecamatan Objek *'),
        items: _kecamatans.map((k) => DropdownMenuItem(value: k, child: Text(k, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: _isOpWilayahPatented ? null : (v) { _setP('kecamatanOp', v ?? ''); _setP('kelurahanOp', ''); },
        validator: (v) => (v == null || v.isEmpty) ? 'Wajib' : null,
      ),
      const SizedBox(height: 12),
      DropdownButtonFormField<String>(
      isExpanded: true,
        key: ValueKey('kelOp_${_currentPecahanIdx}_$kecOp'),
        initialValue: kelurahansOp.contains(p['kelurahanOp'] as String) ? p['kelurahanOp'] as String : null,
        decoration: _dec('Kelurahan/Desa Objek *'),
        items: kelurahansOp.map((k) => DropdownMenuItem(value: k, child: Text(k, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: _isOpWilayahPatented ? null : (v) => _setP('kelurahanOp', v ?? ''),
        validator: (v) => (v == null || v.isEmpty) ? 'Wajib' : null,
      ),
      const SizedBox(height: 12),
      // Koordinat
      Row(children: [
        Expanded(child: TextFormField(key: ValueKey('lat_${_currentPecahanIdx}'), initialValue: p['lat'] as String, decoration: _dec('Latitude'), keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true), onChanged: (v) => _setP('lat', v))),
        const SizedBox(width: 12),
        Expanded(child: TextFormField(key: ValueKey('lng_${_currentPecahanIdx}'), initialValue: p['lng'] as String, decoration: _dec('Longitude'), keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true), onChanged: (v) => _setP('lng', v))),
      ]),
      const SizedBox(height: 12),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Pilih Titik Peta (Opsional)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          Row(
            children: [
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    final poly = p['koordinatPolygon'] as List;
                    if (poly.isNotEmpty) {
                      poly.removeLast();
                      if (poly.isNotEmpty) {
                        p['lat'] = poly.first['lat'].toString();
                        p['lng'] = poly.first['lng'].toString();
                      } else {
                        p['lat'] = '';
                        p['lng'] = '';
                      }
                    }
                  });
                },
                icon: const Icon(Icons.undo, size: 16, color: Colors.orange),
                label: const Text('Undo', style: TextStyle(color: Colors.orange, fontSize: 12)),
              ),
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    (p['koordinatPolygon'] as List).clear();
                    p['lat'] = '';
                    p['lng'] = '';
                  });
                },
                icon: const Icon(Icons.delete_outline, size: 16, color: Colors.red),
                label: const Text('Reset', style: TextStyle(color: Colors.red, fontSize: 12)),
              ),
            ],
          )
        ],
      ),
      Container(
        height: 250,
        decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(12)),
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: FlutterMap(
                options: MapOptions(
                  initialCenter: const LatLng(-7.3878, 109.3620), 
                  initialZoom: 15.0,
                  maxZoom: 22.0,
                  onTap: (tapPosition, point) {
                    setState(() {
                      final poly = p['koordinatPolygon'] as List;
                      poly.add({'lat': point.latitude, 'lng': point.longitude});
                      if (poly.length == 1) {
                        p['lat'] = point.latitude.toString();
                        p['lng'] = point.longitude.toString();
                      }
                    });
                  },
                ),
                children: [
                  TileLayer(
                    urlTemplate: _isSatellite 
                        ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                    userAgentPackageName: 'com.example.magang_bakeuda',
                    maxZoom: 22,
                  ),
                  if ((p['koordinatPolygon'] as List).isNotEmpty)
                    PolygonLayer(
                      polygons: [
                        Polygon(
                          points: (p['koordinatPolygon'] as List).map((e) => LatLng(e['lat'] as double, e['lng'] as double)).toList(),
                          color: Colors.blue.withOpacity(0.3),
                          borderColor: Colors.blue,
                          borderStrokeWidth: 2,
                        )
                      ],
                    ),
                  if ((p['koordinatPolygon'] as List).isNotEmpty)
                    MarkerLayer(
                      markers: (p['koordinatPolygon'] as List).map((e) => Marker(
                        point: LatLng(e['lat'] as double, e['lng'] as double),
                        width: 12, height: 12,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.blue, width: 2),
                          ),
                        ),
                      )).toList(),
                    ),
                ],
              ),
            ),
            Positioned(
              top: 10,
              right: 10,
              child: FloatingActionButton.small(
                onPressed: () => setState(() => _isSatellite = !_isSatellite),
                backgroundColor: Theme.of(context).colorScheme.surface,
                child: Icon(
                  _isSatellite ? Icons.map_outlined : Icons.satellite_alt_outlined,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
          ],
        ),
      ),
      if ((p['koordinatPolygon'] as List).isNotEmpty) ...[
        const SizedBox(height: 16),
        const Text('DAFTAR TITIK KOORDINAT POLIGON', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0D47A1))),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(8)),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingRowColor: MaterialStateProperty.all(Colors.blue.shade50),
                columnSpacing: 24,
                headingTextStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black87),
                dataTextStyle: const TextStyle(fontSize: 12, color: Colors.black87),
                columns: const [
                  DataColumn(label: Text('Titik')),
                  DataColumn(label: Text('Latitude')),
                  DataColumn(label: Text('Longitude')),
                ],
                rows: (p['koordinatPolygon'] as List).asMap().entries.map((e) => DataRow(cells: [
                  DataCell(Text('${e.key + 1}', style: const TextStyle(fontWeight: FontWeight.bold))),
                  DataCell(Text('${e.value['lat']}')),
                  DataCell(Text('${e.value['lng']}')),
                ])).toList(),
              ),
            ),
          ),
        ),
      ],
      const SizedBox(height: 12),
      // Batas
      ExpansionTile(
        title: const Text('Batas-Batas Tanah (Opsional)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
        children: [Padding(
          padding: const EdgeInsets.all(8),
          child: Column(children: [
            Row(children: [
              Expanded(child: TextFormField(key: ValueKey('bU_${_currentPecahanIdx}'), initialValue: p['batasUtara'] as String, decoration: _dec('Batas Utara'), onChanged: (v) => _setP('batasUtara', v))),
              const SizedBox(width: 8),
              Expanded(child: TextFormField(key: ValueKey('bS_${_currentPecahanIdx}'), initialValue: p['batasSelatan'] as String, decoration: _dec('Batas Selatan'), onChanged: (v) => _setP('batasSelatan', v))),
            ]),
            const SizedBox(height: 8),
            Row(children: [
              Expanded(child: TextFormField(key: ValueKey('bT_${_currentPecahanIdx}'), initialValue: p['batasTimur'] as String, decoration: _dec('Batas Timur'), onChanged: (v) => _setP('batasTimur', v))),
              const SizedBox(width: 8),
              Expanded(child: TextFormField(key: ValueKey('bB_${_currentPecahanIdx}'), initialValue: p['batasBarat'] as String, decoration: _dec('Batas Barat'), onChanged: (v) => _setP('batasBarat', v))),
            ]),
          ]),
        )],
      ),
      const SizedBox(height: 16),
      _sectionSubtitle('Jumlah Bangunan'),
      const SizedBox(height: 8),
      TextFormField(
        key: ValueKey('jmlBng_${_currentPecahanIdx}'),
        initialValue: p['jumlahBangunan'] as String,
        decoration: _dec('Jumlah Bangunan (isi 0 jika tanah kosong)'),
        keyboardType: TextInputType.number,
        readOnly: p['jenisTanah'] == 'TANAH_KOSONG',
        inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(2)],
        onChanged: (v) => _setP('jumlahBangunan', v),
      ),
    ]);
  }

  // ───────────────────────────────────────────────
  // Sub-step 2: Bangunan per-Pecahan (full detail)
  // ───────────────────────────────────────────────
  Widget _buildPecahanBangunan() {
    final dataBng = (_cp['dataBangunan'] as List);
    if (dataBng.isEmpty || _currentPecahanBangunanIdx > dataBng.length) {
      return const Center(child: Padding(padding: EdgeInsets.all(24), child: Text('Data bangunan tidak ditemukan')));
    }
    final b = dataBng[_currentPecahanBangunanIdx - 1] as Map<String, dynamic>;

    Widget tf(String key, String label, TextInputType kbt, {List<TextInputFormatter>? fmt, String? Function(String?)? val}) => TextFormField(
      key: ValueKey('b_${_currentPecahanIdx}_${_currentPecahanBangunanIdx}_$key'),
      initialValue: b[key]?.toString() ?? '',
      decoration: _dec(label),
      keyboardType: kbt,
      inputFormatters: fmt,
      onChanged: (v) => _setB(key, v),
      validator: val,
    );

    Widget dd(String key, String label, List<String> items) {
      final cv = b[key]?.toString();
      final sv = items.contains(cv) ? cv : items.first;
      return DropdownButtonFormField<String>(
      isExpanded: true,
        key: ValueKey('bdd_${_currentPecahanIdx}_${_currentPecahanBangunanIdx}_$key'),
        initialValue: sv,
        decoration: _dec(label),
        items: items.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: (v) => _setB(key, v),
      );
    }

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Bangunan ke-$_currentPecahanBangunanIdx dari ${_cp['jumlahBangunan']}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F2C59))),
      const SizedBox(height: 12),
      ExpansionTile(
        initiallyExpanded: true,
        title: const Text('Rincian Utama', style: TextStyle(fontWeight: FontWeight.bold)),
        childrenPadding: const EdgeInsets.all(8),
        children: [
          dd('jenisPenggunaan', 'Jenis Penggunaan', Constants.jenisPenggunaanBangunan),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: tf('luasBangunan', 'Luas (m²) *', TextInputType.number,
              val: (v) { if (v == null || v.isEmpty) return 'Wajib'; if ((double.tryParse(v) ?? 0) <= 0) return '> 0'; return null; })),
            const SizedBox(width: 12),
            Expanded(child: tf('jumlahLantai', 'Jml Lantai *', TextInputType.number,
              fmt: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(2)],
              val: (v) { final j = int.tryParse(v ?? '') ?? 0; if (j < 1 || j > 99) return '1-99'; return null; })),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: tf('tahunDibangun', 'Thn Dibangun *', TextInputType.number,
              fmt: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(4)],
              val: (v) { if ((v?.length ?? 0) != 4) return '4 digit'; final t = int.tryParse(v ?? '') ?? 0; if (t < 1900 || t > DateTime.now().year) return 'Tdk valid'; return null; })),
            const SizedBox(width: 12),
            Expanded(child: tf('tahunDirenovasi', 'Thn Renovasi (Ops)', TextInputType.number,
              fmt: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(4)],
              val: (v) { if (v != null && v.isNotEmpty) { if (v.length != 4) return '4 digit'; final t = int.tryParse(v) ?? 0; if (t < 1900 || t > DateTime.now().year) return 'Tdk valid'; } return null; })),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: tf('dayaListrik', 'Daya Listrik (W) *', TextInputType.number,
              fmt: [FilteringTextInputFormatter.digitsOnly],
              val: (v) => (v == null || v.isEmpty) ? 'Wajib (isi 0)' : null)),
            const SizedBox(width: 12),
            Expanded(child: dd('kondisi', 'Kondisi', Constants.kondisiBangunan)),
          ]),
        ],
      ),
      ExpansionTile(
        initiallyExpanded: false,
        title: const Text('Spesifikasi Material', style: TextStyle(fontWeight: FontWeight.bold)),
        childrenPadding: const EdgeInsets.all(8),
        children: [
          dd('konstruksi', 'Konstruksi', Constants.konstruksiBangunan), const SizedBox(height: 12),
          dd('atap', 'Atap', Constants.atapBangunan), const SizedBox(height: 12),
          dd('dinding', 'Dinding', Constants.dindingBangunan), const SizedBox(height: 12),
          dd('lantai', 'Lantai', Constants.lantaiBangunan), const SizedBox(height: 12),
          dd('langitLangit', 'Langit-langit', Constants.langitLangitBangunan),
        ],
      ),
      ExpansionTile(
        initiallyExpanded: false,
        title: const Text('Fasilitas (Opsional)', style: TextStyle(fontWeight: FontWeight.bold)),
        childrenPadding: const EdgeInsets.all(8),
        children: [
          SwitchListTile(title: const Text('Pendingin Ruangan (AC)'), value: b['hasAC'] == true, onChanged: (v) => _setB('hasAC', v)),
          if (b['hasAC'] == true) ...[
            Row(children: [Expanded(child: tf('acSplit', 'Jml AC Split', TextInputType.number)), const SizedBox(width: 12), Expanded(child: tf('acWindow', 'Jml AC Window', TextInputType.number))]),
            const SizedBox(height: 12), dd('acSentral', 'AC Sentral', ['Ada', 'Tidak Ada']), const Divider(),
          ],
          SwitchListTile(title: const Text('Kolam Renang'), value: b['hasKolamRenang'] == true, onChanged: (v) => _setB('hasKolamRenang', v)),
          if (b['hasKolamRenang'] == true) ...[
            tf('kolamRenangLuas', 'Luas Kolam (m²)', TextInputType.number), const SizedBox(height: 12),
            dd('kolamRenangFinishing', 'Finishing', ['Diplester', 'Dengan Pelapis']), const Divider(),
          ],
          SwitchListTile(title: const Text('Pagar Halaman'), value: b['hasPagar'] == true, onChanged: (v) => _setB('hasPagar', v)),
          if (b['hasPagar'] == true) ...[
            tf('panjangPagar', 'Panjang Pagar (M)', TextInputType.number), const SizedBox(height: 12),
            dd('bahanPagar', 'Bahan Pagar', ['Baja/Besi', 'Bata/Batako']), const Divider(),
          ],
          SwitchListTile(title: const Text('Perkerasan Halaman'), value: b['hasHalaman'] == true, onChanged: (v) => _setB('hasHalaman', v)),
          if (b['hasHalaman'] == true) ...[
            tf('halamanRingan', 'Halaman Ringan (m²)', TextInputType.number), const SizedBox(height: 8),
            tf('halamanSedang', 'Halaman Sedang (m²)', TextInputType.number), const SizedBox(height: 8),
            tf('halamanBerat', 'Halaman Berat (m²)', TextInputType.number), const SizedBox(height: 8),
            tf('halamanPenutupLantai', 'Dgn Penutup Lantai (m²)', TextInputType.number), const Divider(),
          ],
          SwitchListTile(title: const Text('Lift / Eskalator'), value: b['hasLift'] == true, onChanged: (v) => _setB('hasLift', v)),
          if (b['hasLift'] == true) ...[
            Row(children: [Expanded(child: tf('liftPenumpang', 'Lift Penumpang', TextInputType.number)), const SizedBox(width: 8), Expanded(child: tf('liftKapsul', 'Lift Kapsul', TextInputType.number)), const SizedBox(width: 8), Expanded(child: tf('liftBarang', 'Lift Barang', TextInputType.number))]),
            const SizedBox(height: 8),
            Row(children: [Expanded(child: tf('tanggaBerjalanKecil', 'Eskalator <0.8m', TextInputType.number)), const SizedBox(width: 8), Expanded(child: tf('tanggaBerjalanBesar', 'Eskalator >0.8m', TextInputType.number))]),
            const Divider(),
          ],
          SwitchListTile(title: const Text('Pemadam Kebakaran'), value: b['hasPemadam'] == true, onChanged: (v) => _setB('hasPemadam', v)),
          if (b['hasPemadam'] == true) ...[
            Row(children: [Expanded(child: dd('pemadamHydrant', 'Hydrant', ['Ada', 'Tidak Ada'])), const SizedBox(width: 8), Expanded(child: dd('pemadamSprinkler', 'Sprinkler', ['Ada', 'Tidak Ada'])), const SizedBox(width: 8), Expanded(child: dd('pemadamFireAl', 'Fire Alarm', ['Ada', 'Tidak Ada']))]),
            const Divider(),
          ],
          SwitchListTile(title: const Text('Lapangan Tenis'), value: b['hasTenis'] == true, onChanged: (v) => _setB('hasTenis', v)),
          if (b['hasTenis'] == true) ...[
            const Padding(padding: EdgeInsets.symmetric(vertical: 4, horizontal: 16), child: Text('Dengan Lampu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
            Row(children: [Expanded(child: tf('lapanganTenisLampuBeton', 'Beton', TextInputType.number)), const SizedBox(width: 6), Expanded(child: tf('lapanganTenisLampuAspal', 'Aspal', TextInputType.number)), const SizedBox(width: 6), Expanded(child: tf('lapanganTenisLampuTanah', 'Tanah/Rumput', TextInputType.number))]),
            const Padding(padding: EdgeInsets.symmetric(vertical: 4, horizontal: 16), child: Text('Tanpa Lampu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
            Row(children: [Expanded(child: tf('lapanganTenisTanpaLampuBeton', 'Beton', TextInputType.number)), const SizedBox(width: 6), Expanded(child: tf('lapanganTenisTanpaLampuAspal', 'Aspal', TextInputType.number)), const SizedBox(width: 6), Expanded(child: tf('lapanganTenisTanpaLampuTanah', 'Tanah/Rumput', TextInputType.number))]),
            const Divider(),
          ],
          SwitchListTile(title: const Text('Saluran PABX & Sumur Artesis'), value: b['hasLain'] == true, onChanged: (v) => _setB('hasLain', v)),
          if (b['hasLain'] == true) ...[
            tf('saluranPabx', 'Jml Saluran PABX', TextInputType.number), const SizedBox(height: 8),
            tf('sumurArtesis', 'Kedalaman Sumur (M)', TextInputType.number),
          ],
        ],
      ),
    ]);
  }

  // ───────────────────────────────────────────────
  // Sub-step 3: Lampiran per-Pecahan
  // ───────────────────────────────────────────────
  Widget _buildPecahanLampiran() {
    final p = _cp;
    final lampiranList = List<Map<String, dynamic>>.from(
      (p['lampiran'] as List).map((e) => Map<String, dynamic>.from(e as Map)),
    );
    final selectedJenis = p['selectedJenisDokumen'] as String? ?? 'KTP';

    const jenisDokumenOpts = [
      'KTP', 'Sertifikat Hak Milik', 'Akte Jual Beli',
      'Izin Mendirikan Bangunan', 'Surat Kuasa', 'Foto/Pendukung Lainnya',
    ];

    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      _sectionTitle('Lampiran Pecahan $_currentPecahanIdx'),
      const SizedBox(height: 4),
      const Text('Upload dokumen pendukung khusus untuk pecahan ini.', style: TextStyle(color: Colors.grey, fontSize: 12)),
      const SizedBox(height: 16),
      DropdownButtonFormField<String>(
      isExpanded: true,
        initialValue: jenisDokumenOpts.contains(selectedJenis) ? selectedJenis : jenisDokumenOpts.first,
        decoration: _dec('Jenis Dokumen'),
        items: jenisDokumenOpts.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(fontSize: 13)))).toList(),
        onChanged: (v) => _setP('selectedJenisDokumen', v),
      ),
      const SizedBox(height: 12),
      SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: _isLoading ? null : _pickFilePecahan,
          icon: _isLoading
              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Icon(Icons.upload_file_outlined),
          label: Text(_isLoading ? 'Mengunggah...' : 'Pilih & Unggah File'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0F2C59),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ),
      const SizedBox(height: 6),
      const Text('Format: PDF, JPG, PNG', style: TextStyle(color: Colors.grey, fontSize: 11)),
      const SizedBox(height: 16),
      if (lampiranList.isEmpty)
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.amber.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.amber.shade200)),
          child: const Row(children: [
            Icon(Icons.warning_amber_outlined, color: Colors.amber, size: 20),
            SizedBox(width: 8),
            Expanded(child: Text('Belum ada lampiran.\nDisarankan upload minimal KTP pemilik baru.', style: TextStyle(color: Colors.amber, fontSize: 12))),
          ]),
        )
      else
        ...lampiranList.asMap().entries.map((entry) {
          final idx = entry.key;
          final l = entry.value;
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            child: ListTile(
              dense: true,
              leading: const Icon(Icons.description_outlined, color: Color(0xFF0F2C59)),
              title: Text(l['jenis_dokumen'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              subtitle: Text(
                (l['url_file'] as String).split('/').last,
                style: const TextStyle(fontSize: 11, color: Colors.grey),
                overflow: TextOverflow.ellipsis,
              ),
              trailing: IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                onPressed: () {
                  final updated = List<Map<String, dynamic>>.from(lampiranList);
                  updated.removeAt(idx);
                  updateFormState(() => _pecahanList[_currentPecahanIdx - 1]['lampiran'] = updated);
                },
              ),
            ),
          );
        }),
    ]);
  }

  Future<void> _pickFilePecahan() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      allowMultiple: false,
    );
    if (result != null && result.files.single.path != null) {
      final file = result.files.single;
      updateFormState(() => _isLoading = true);
      try {
        final url = await _spopService.uploadFile(file.path!, file.name);
        final jenis = _cp['selectedJenisDokumen'] as String? ?? 'KTP';
        final updated = List<Map<String, dynamic>>.from(
          (_cp['lampiran'] as List).map((e) => Map<String, dynamic>.from(e as Map)),
        );
        updated.add({'jenis_dokumen': jenis, 'url_file': url});
        updateFormState(() => _pecahanList[_currentPecahanIdx - 1]['lampiran'] = updated);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('✅ ${file.name} diunggah untuk Pecahan $_currentPecahanIdx')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal unggah: $e'), backgroundColor: Colors.red),
          );
        }
      } finally {
        if (mounted) updateFormState(() => _isLoading = false);
      }
    }
  }

  // ───────────────────────────────────────────────
  // UI Helpers
  // ───────────────────────────────────────────────
  InputDecoration _dec(String label) => InputDecoration(
    labelText: label,
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
  );

  Widget _sectionTitle(String text) => Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F2C59)));
  Widget _sectionSubtitle(String text) => Column(children: [Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)), const Divider()]);
}
