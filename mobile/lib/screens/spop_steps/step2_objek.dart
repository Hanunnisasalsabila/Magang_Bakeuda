part of '../spop_form_screen.dart';

extension _Step2Extension on _SpopFormScreenState {
  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              flex: 2,
              child: CustomDropdown<String>(
                label: 'Jenis Tanah',
                value: _jenisTanah,
                items: _jenisTanahOptions
                    .map(
                      (o) => DropdownMenuItem(
                        value: o['value'],
                        child: Text(
                          o['label']!,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                    )
                    .toList(),
                onChanged: (v) {
                  updateFormState(() {
                    _jenisTanah = v!;
                    if (v == 'TANAH_KOSONG') {
                      _jmlBangunanController.text = '0';
                    } else if (_jmlBangunanController.text == '0' ||
                        _jmlBangunanController.text.isEmpty) {
                      _jmlBangunanController.text = '1';
                    }
                  });
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: CustomTextField(
                controller: _luasTanahController,
                label: 'Luas (m²) *',
                keyboardType: TextInputType.number,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Wajib diisi';
                  if ((double.tryParse(v) ?? 0) <= 0) return 'Harus > 0';
                  return null;
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        CustomTextField(
          controller: _jmlBangunanController,
          label: 'Jumlah Bangunan *',
          keyboardType: TextInputType.number,
          readOnly: _jenisTanah == 'TANAH_KOSONG',
          inputFormatters: [
            LengthLimitingTextInputFormatter(2),
            FilteringTextInputFormatter.digitsOnly,
          ],
          validator: (v) {
            if (_jenisTanah == 'TANAH_KOSONG') return null;
            return v == null || v.isEmpty ? 'Wajib diisi' : null;
          },
        ),
        const SizedBox(height: 12),
        CustomTextField(
          controller: _jalanOpController,
          label: 'Alamat Objek (Jalan) *',
          maxLines: 2,
          validator: (v) {
            if (v == null || v.isEmpty) return 'Wajib diisi';
            if (v.length < 5) return 'Minimal 5 karakter';
            return null;
          },
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: CustomTextField(
                controller: _rtOpController,
                label: 'RT *',
                keyboardType: TextInputType.number,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(3),
                  FilteringTextInputFormatter.digitsOnly,
                ],
                validator: (v) => v == null || v.isEmpty ? 'Wajib' : null,
                hintText: '001',
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: CustomTextField(
                controller: _rwOpController,
                label: 'RW *',
                keyboardType: TextInputType.number,
                inputFormatters: [
                  LengthLimitingTextInputFormatter(3),
                  FilteringTextInputFormatter.digitsOnly,
                ],
                validator: (v) => v == null || v.isEmpty ? 'Wajib' : null,
                hintText: '001',
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: CustomDropdown<String>(
                label: 'Kecamatan Objek *',
                value: _getValidKecamatan(_kecamatanOpController.text),
                items: _kecamatans
                    .map(
                      (e) => DropdownMenuItem(
                        value: e,
                        child: Text(
                          e,
                          style: const TextStyle(fontSize: 14),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    )
                    .toList(),
                onChanged: _isOpWilayahPatented
                    ? null
                    : (v) => updateFormState(() {
                        _kecamatanOpController.text = v ?? '';
                        _kelurahanOpController.text = ''; // Reset
                      }),
                validator: (v) => v == null || v.isEmpty ? '*' : null,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: CustomDropdown<String>(
                label: 'Kelurahan Objek *',
                value: _getValidKelurahan(
                  _kecamatanOpController.text,
                  _kelurahanOpController.text,
                ),
                items: _getValidKecamatan(_kecamatanOpController.text) != null
                    ? WilayahData.data
                          .where(
                            (e) =>
                                e['kecamatan'] ==
                                _getValidKecamatan(_kecamatanOpController.text),
                          )
                          .map((e) => e['nama_desa']!)
                          .toSet()
                          .toList()
                          .map(
                            (e) => DropdownMenuItem(
                              value: e,
                              child: Text(
                                e,
                                style: const TextStyle(fontSize: 14),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          )
                          .toList()
                    : [],
                onChanged: _isOpWilayahPatented
                    ? null
                    : (v) => updateFormState(
                        () => _kelurahanOpController.text = v ?? '',
                      ),
                validator: (v) => v == null || v.isEmpty ? '*' : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: CustomTextField(
                controller: _blokKavController,
                label: 'Blok/Kav/No',
                inputFormatters: [LengthLimitingTextInputFormatter(10)],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Text(
          'Batas-batas Tanah:',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: CustomTextField(
                controller: _batasUtaraController,
                label: 'Utara',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: CustomTextField(
                controller: _batasSelatanController,
                label: 'Selatan',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: CustomTextField(
                controller: _batasTimurController,
                label: 'Timur',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: CustomTextField(
                controller: _batasBaratController,
                label: 'Barat',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Text(
          'Cari Lokasi / Nama Jalan:',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _mapSearchController,
                decoration: InputDecoration(
                  hintText: 'Misal: Purbalingga Lor',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                onSubmitted: (_) => _searchLocation(),
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: _isMapSearching ? null : _searchLocation,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  vertical: 14,
                  horizontal: 16,
                ),
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: _isMapSearching
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : const Text('Cari'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerRight,
          child: TextButton.icon(
            onPressed: _isMapSearching ? null : _getCurrentLocation,
            icon: const Icon(Icons.my_location, size: 18),
            label: const Text('Lokasi Saya'),
          ),
        ),
        const SizedBox(height: 8),
        Container(
          height: 300,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: FlutterMap(
                  mapController: _mapController,
                  options: MapOptions(
                    initialCenter: const LatLng(
                      -7.3878,
                      109.3620,
                    ), // Purbalingga default
                    initialZoom: 15.0,
                    maxZoom: 22.0,
                    onTap: (tapPosition, point) {
                      updateFormState(() {
                        _polygonPoints.add(point);
                        if (_polygonPoints.length == 1) {
                          _latController.text = point.latitude.toString();
                          _lngController.text = point.longitude.toString();
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
                    if (_searchBoundary.isNotEmpty)
                      PolygonLayer(
                        polygons: [
                          Polygon(
                            points: _searchBoundary,
                            color: Colors.blue.withOpacity(0.1),
                            borderColor: Colors.blue,
                            borderStrokeWidth: 2,
                          ),
                        ],
                      ),
                    if (_searchReferencePoint != null)
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: _searchReferencePoint!,
                            width: 40,
                            height: 40,
                            child: const Icon(
                              Icons.location_on,
                              color: Colors.blue,
                              size: 40,
                            ),
                          ),
                        ],
                      ),
                    if (_polygonPoints.isNotEmpty)
                      PolygonLayer(
                        polygons: [
                          Polygon(
                            points: _polygonPoints,
                            color: Colors.blue.withOpacity(0.3),
                            borderColor: Colors.blue,
                            borderStrokeWidth: 2,
                          ),
                        ],
                      ),
                    if (_polygonPoints.isNotEmpty)
                      MarkerLayer(
                        markers: _polygonPoints
                            .map(
                              (p) => Marker(
                                point: p,
                                width: 12,
                                height: 12,
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.blue,
                                      width: 2,
                                    ),
                                  ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                  ],
                ),
              ),
              Positioned(
                top: 10,
                right: 10,
                child: FloatingActionButton.small(
                  onPressed: () =>
                      updateFormState(() => _isSatellite = !_isSatellite),
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  child: Icon(
                    _isSatellite
                        ? Icons.map_outlined
                        : Icons.satellite_alt_outlined,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _polygonPoints.isEmpty
                    ? null
                    : () => updateFormState(() {
                        _polygonPoints.removeLast();
                        if (_polygonPoints.isNotEmpty) {
                          _latController.text = _polygonPoints.first.latitude
                              .toString();
                          _lngController.text = _polygonPoints.first.longitude
                              .toString();
                        } else {
                          _latController.text = '';
                          _lngController.text = '';
                        }
                      }),
                icon: const Icon(Icons.undo, size: 18),
                label: const Text('Batal Titik'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange.shade50,
                  foregroundColor: Colors.orange.shade800,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _polygonPoints.isEmpty
                    ? null
                    : () => updateFormState(() {
                        _polygonPoints.clear();
                        _latController.text = '';
                        _lngController.text = '';
                      }),
                icon: const Icon(Icons.delete, size: 18),
                label: const Text('Hapus Semua'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade50,
                  foregroundColor: Colors.red,
                ),
              ),
            ),
          ],
        ),
        if (_polygonPoints.isNotEmpty) ...[
          const SizedBox(height: 16),
          const Text(
            'DAFTAR TITIK KOORDINAT POLIGON',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 12,
              color: Color(0xFF0D47A1),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  headingRowColor: MaterialStateProperty.all(
                    Colors.blue.shade50,
                  ),
                  columnSpacing: 24,
                  headingTextStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.black87,
                  ),
                  dataTextStyle: const TextStyle(
                    fontSize: 12,
                    color: Colors.black87,
                  ),
                  columns: const [
                    DataColumn(label: Text('Titik')),
                    DataColumn(label: Text('Latitude')),
                    DataColumn(label: Text('Longitude')),
                  ],
                  rows: _polygonPoints
                      .asMap()
                      .entries
                      .map(
                        (e) => DataRow(
                          cells: [
                            DataCell(
                              Text(
                                '${e.key + 1}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            DataCell(Text('${e.value.latitude}')),
                            DataCell(Text('${e.value.longitude}')),
                          ],
                        ),
                      )
                      .toList(),
                ),
              ),
            ),
          ),
        ],
        const SizedBox(height: 12),
        if (_polygonPoints.isNotEmpty) ...[
          Text(
            'Lihat di Peta Eksternal:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ElevatedButton.icon(
                onPressed: () async {
                  final url = Uri.parse(
                    'https://www.google.com/maps?q=${_latController.text},${_lngController.text}',
                  );
                  if (await canLaunchUrl(url)) await launchUrl(url);
                },
                icon: const Icon(Icons.map, size: 18),
                label: const Text('Google Maps'),
              ),
              ElevatedButton.icon(
                onPressed: () async {
                  final lats = _polygonPoints.map((p) => p.latitude).toList();
                  final lngs = _polygonPoints.map((p) => p.longitude).toList();
                  final centerLat = lats.reduce((a, b) => a + b) / lats.length;
                  final centerLng = lngs.reduce((a, b) => a + b) / lngs.length;
                  final coordStr = '$centerLat, $centerLng';
                  await Clipboard.setData(ClipboardData(text: coordStr));
                  if (context.mounted)
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Koordinat disalin!'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  final url = Uri.parse('https://bhumi.atrbpn.go.id/peta');
                  if (await canLaunchUrl(url)) await launchUrl(url);
                },
                icon: const Icon(Icons.public, size: 18),
                label: const Text('BHUMI ATR/BPN'),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
        if (_polygonPoints.isEmpty) ...[
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: CustomTextField(
                  controller: _latController,
                  label: 'Latitude',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomTextField(
                  controller: _lngController,
                  label: 'Longitude',
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
