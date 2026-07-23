import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:dio/dio.dart';
import 'package:geolocator/geolocator.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';
import '../utils/formatters.dart';
import '../widgets/selectable_card.dart';

class SpopFormScreen extends StatefulWidget {
  final String? idTransaksi;
  const SpopFormScreen({super.key, this.idTransaksi});

  @override
  State<SpopFormScreen> createState() => _SpopFormScreenState();
}

class _SpopFormScreenState extends State<SpopFormScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isSavingDraft = false;
  Map<String, dynamic>? _fetchedObjekPajak;

  // Step 1 - Kategori & Jenis
  String _selectedKategori = 'BARU'; // BARU, PEMUTAKHIRAN, PENGHAPUSAN
  String _jenisLayanan = 'BARU'; // BARU, PECAH, GABUNG, MUTASI, PERUBAHAN_DATA, HAPUS
  
  final _nopUtamaController = TextEditingController();
  final List<TextEditingController> _nopAsalControllers = [TextEditingController()];
  final _nopBersamaController = TextEditingController();
  final _noSpptLamaController = TextEditingController();
  final _alasanHapusController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    if (widget.idTransaksi != null) {
      _loadDraftData();
    }
  }

  Future<void> _loadDraftData() async {
    setState(() => _isLoading = true);
    try {
      final d = await _spopService.getDetailTransaksi(widget.idTransaksi!);
      setState(() {
        _jenisLayanan = d['jenis_transaksi'] ?? 'BARU';
        
        final nopAsalList = d['detail_asal'] as List?;
        if (nopAsalList != null && nopAsalList.isNotEmpty) {
           _nopAsalControllers.clear();
           for (var asal in nopAsalList) {
             _nopAsalControllers.add(TextEditingController(text: asal['nop_asal'] ?? ''));
           }
        }
        if (_nopAsalControllers.isEmpty) {
           _nopAsalControllers.add(TextEditingController());
        }
        
        final tujuanList = d['detail_tujuan'] as List?;
        if (tujuanList != null && tujuanList.isNotEmpty) {
           final tujuan = tujuanList[0];
           final subjek = tujuan['calon_subjek_json'];
           if (subjek != null) {
              _namaWpController.text = subjek['nama_subjek'] ?? '';
              _nikController.text = subjek['nik'] ?? '';
              _npwpController.text = subjek['npwp'] ?? '';
              _noHpController.text = subjek['no_hp'] ?? '';
              _alamatWpController.text = subjek['alamat_jalan'] ?? '';
              _rtController.text = subjek['rt'] ?? '';
              _rwController.text = subjek['rw'] ?? '';
              _kelurahanWpController.text = subjek['kelurahan'] ?? '';
              _kecamatanWpController.text = subjek['kecamatan'] ?? '';
              _kodePosController.text = subjek['kode_pos'] ?? '';
           }
           _luasTanahController.text = (tujuan['luas_tanah_baru'] ?? '').toString();
           _jalanOpController.text = tujuan['jalan_op_baru'] ?? '';
           _blokKavController.text = tujuan['blok_kav_no_baru'] ?? '';
           _rtOpController.text = tujuan['rt_op_baru'] ?? '';
           _rwOpController.text = tujuan['rw_op_baru'] ?? '';
           _kelurahanOpController.text = tujuan['kelurahan_op_baru'] ?? '';
           _kecamatanOpController.text = tujuan['kecamatan_op_baru'] ?? '';
        }
      });
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal memuat draft: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // Map States
  final MapController _mapController = MapController();
  final TextEditingController _mapSearchController = TextEditingController();
  bool _isMapSearching = false;
  List<LatLng> _searchBoundary = [];
  LatLng? _searchReferencePoint;

  // Step 2 - Data Subjek Pajak
  final _namaWpController = TextEditingController();
  final _nikController = TextEditingController();
  final _npwpController = TextEditingController();
  final _noHpController = TextEditingController();
  final List<LatLng> _polygonPoints = [];
  
  String _statusWp = 'PEMILIK';
  String _pekerjaan = 'PNS';
  final _alamatWpController = TextEditingController();
  final _rtController = TextEditingController();
  final _rwController = TextEditingController();
  final _kelurahanWpController = TextEditingController();
  final _kecamatanWpController = TextEditingController();
  final _kabupatenWpController = TextEditingController(text: 'Purbalingga');
  final _kodePosController = TextEditingController();

  final List<Map<String, String>> _statusWpOptions = [
    {'label': 'Pemilik', 'value': 'PEMILIK'},
    {'label': 'Penyewa', 'value': 'PENYEWA'},
    {'label': 'Pengelola', 'value': 'PENGELOLA'},
    {'label': 'Pemakai', 'value': 'PEMAKAI'},
    {'label': 'Sengketa', 'value': 'SENGKETA'},
  ];
  final List<Map<String, String>> _pekerjaanOptions = [
    {'label': 'PNS', 'value': 'PNS'},
    {'label': 'Pegawai Swasta', 'value': 'PEGAWAI_SWASTA'},
    {'label': 'Wiraswasta', 'value': 'WIRASWASTA'},
    {'label': 'Petani', 'value': 'PETANI'},
    {'label': 'Nelayan', 'value': 'NELAYAN'},
    {'label': 'Lainnya', 'value': 'LAINNYA'},
  ];

  // Step 3 - Data Objek Pajak
  String _jenisTanah = 'TANAH_DAN_BANGUNAN';
  final _luasTanahController = TextEditingController();
  final _jalanOpController = TextEditingController();
  final _blokKavController = TextEditingController();
  final _rtOpController = TextEditingController();
  final _rwOpController = TextEditingController();
  final _kelurahanOpController = TextEditingController();
  final _kecamatanOpController = TextEditingController();
  final _batasUtaraController = TextEditingController();
  final _batasSelatanController = TextEditingController();
  final _batasTimurController = TextEditingController();
  final _batasBaratController = TextEditingController();
  bool _isSatellite = true;
  final _latController = TextEditingController(text: '-7.3934');
  final _lngController = TextEditingController(text: '109.3663');

  final List<Map<String, String>> _jenisTanahOptions = [
    {'label': 'Tanah + Bangunan', 'value': 'TANAH_DAN_BANGUNAN'},
    {'label': 'Kavling Siap Bangun', 'value': 'TANAH_KOSONG'},
    {'label': 'Tanah Kosong', 'value': 'TANAH_KOSONG'},
  ];

  // Step 4 - Lampiran
  final List<Map<String, String>> _lampiran = [];

  @override
  void dispose() {
    _nopUtamaController.dispose();
    for (var c in _nopAsalControllers) { c.dispose(); }
    _nopBersamaController.dispose();
    _noSpptLamaController.dispose();
    _alasanHapusController.dispose();
    _namaWpController.dispose();
    _nikController.dispose();
    _npwpController.dispose();
    _noHpController.dispose();
    _alamatWpController.dispose();
    _rtController.dispose();
    _rwController.dispose();
    _kelurahanWpController.dispose();
    _kecamatanWpController.dispose();
    _kabupatenWpController.dispose();
    _kodePosController.dispose();
    _luasTanahController.dispose();
    _jalanOpController.dispose();
    _blokKavController.dispose();
    _rtOpController.dispose();
    _rwOpController.dispose();
    _kelurahanOpController.dispose();
    _kecamatanOpController.dispose();
    _batasUtaraController.dispose();
    _batasSelatanController.dispose();
    _batasTimurController.dispose();
    _batasBaratController.dispose();
    _latController.dispose();
    _lngController.dispose();
    _mapSearchController.dispose();
    super.dispose();
  }

  Future<void> _searchLocation() async {
    final val = _mapSearchController.text.trim();
    if (val.length < 3) return;
    
    setState(() => _isMapSearching = true);
    try {
      final queryText = val.toLowerCase().contains('purbalingga') ? val : '$val Purbalingga';
      final dio = Dio();
      final res = await dio.get('https://photon.komoot.io/api/', queryParameters: {
        'q': queryText,
        'lat': -7.3888,
        'lon': 109.3637,
        'limit': 1
      });
      
      final features = res.data['features'] as List;
      if (features.isNotEmpty) {
        final props = features[0]['properties'];
        final geom = features[0]['geometry'];
        final lat = (geom['coordinates'][1] as num).toDouble();
        final lon = (geom['coordinates'][0] as num).toDouble();
        
        final isArea = props['osm_type'] == 'R';
        List<LatLng> bounds = [];
        if (isArea) {
          final nomRes = await dio.get('https://nominatim.openstreetmap.org/lookup', queryParameters: {
            'osm_ids': 'R${props['osm_id']}',
            'format': 'json',
            'polygon_geojson': 1
          });
          if (nomRes.data is List && nomRes.data.isNotEmpty) {
            final geojson = nomRes.data[0]['geojson'];
            if (geojson != null && (geojson['type'] == 'Polygon' || geojson['type'] == 'MultiPolygon')) {
              List coords = geojson['type'] == 'MultiPolygon' 
                  ? geojson['coordinates'][0][0] 
                  : geojson['coordinates'][0];
              bounds = coords.map<LatLng>((c) => LatLng((c[1] as num).toDouble(), (c[0] as num).toDouble())).toList();
            }
          }
        }
        
        setState(() {
          if (bounds.isNotEmpty) {
            _searchBoundary = bounds;
            _searchReferencePoint = null;
            double centerLat = bounds.map((e) => e.latitude).reduce((a, b) => a + b) / bounds.length;
            double centerLng = bounds.map((e) => e.longitude).reduce((a, b) => a + b) / bounds.length;
            _mapController.move(LatLng(centerLat, centerLng), 14.0);
          } else {
            _searchBoundary = [];
            _searchReferencePoint = LatLng(lat, lon);
            _mapController.move(LatLng(lat, lon), 18.0);
          }
        });
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => _isMapSearching = false);
    }
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return;

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    if (permission == LocationPermission.deniedForever) return;

    setState(() => _isMapSearching = true);
    try {
      Position position = await Geolocator.getCurrentPosition();
      setState(() {
        _searchBoundary = [];
        _searchReferencePoint = LatLng(position.latitude, position.longitude);
        _mapController.move(LatLng(position.latitude, position.longitude), 18.0);
      });
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      setState(() => _isMapSearching = false);
    }
  }

  Future<void> _fetchNopData() async {
    final rawNop = _nopUtamaController.text.replaceAll('.', '').trim();
    if (rawNop.length < 18) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('NOP harus 18 digit!'), backgroundColor: Colors.orange),
        );
      }
      return;
    }
    
    setState(() => _isLoading = true);
    try {
      final obj = await _spopService.getObjekPajakByNop(rawNop);
      if (obj != null) {
        // Auto-fill Data Objek
        setState(() {
          _fetchedObjekPajak = obj;
          if (obj['luas_tanah'] != null) _luasTanahController.text = obj['luas_tanah'].toString();
          if (obj['jalan_op'] != null) _jalanOpController.text = obj['jalan_op'].toString();
          if (obj['blok_kav_no_op'] != null) _blokKavController.text = obj['blok_kav_no_op'].toString();
          if (obj['rt_op'] != null) _rtOpController.text = obj['rt_op'].toString();
          if (obj['rw_op'] != null) _rwOpController.text = obj['rw_op'].toString();
          if (obj['jenis_tanah'] != null) _jenisTanah = obj['jenis_tanah'].toString();
          if (obj['latitude'] != null) _latController.text = obj['latitude'].toString();
          if (obj['longitude'] != null) _lngController.text = obj['longitude'].toString();
          if (obj['batas_utara'] != null) _batasUtaraController.text = obj['batas_utara'].toString();
          if (obj['batas_selatan'] != null) _batasSelatanController.text = obj['batas_selatan'].toString();
          if (obj['batas_timur'] != null) _batasTimurController.text = obj['batas_timur'].toString();
          if (obj['batas_barat'] != null) _batasBaratController.text = obj['batas_barat'].toString();
          
          if (obj['koordinat_polygon'] != null) {
             _polygonPoints.clear();
             try {
               final polyList = obj['koordinat_polygon'] is String ? null : obj['koordinat_polygon'] as List;
               if (polyList != null) {
                 for (var point in polyList) {
                   _polygonPoints.add(LatLng((point['lat'] as num).toDouble(), (point['lng'] as num).toDouble()));
                 }
               }
             } catch (_) {}
          }
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('✅ Data Objek Pajak berhasil ditemukan & diisi otomatis'), backgroundColor: Colors.green),
          );
        }
      } else {
        setState(() {
          _fetchedObjekPajak = null;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Data tidak ditemukan untuk NOP $rawNop'), backgroundColor: Theme.of(context).colorScheme.error),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal mencari NOP: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Map<String, dynamic> _buildPayload() {
    final payload = <String, dynamic>{
      'jenis_layanan': _jenisLayanan,
    };
    
    final nop = _nopUtamaController.text.replaceAll('.', '');
    if (nop.isNotEmpty) payload['nop_utama'] = nop;
    
    if (_jenisLayanan == 'PECAH' || _jenisLayanan == 'GABUNG') {
      final nopAsal = _nopAsalControllers.map((c) => c.text.replaceAll('.', '').trim()).where((e) => e.isNotEmpty).toList();
      if (nopAsal.isNotEmpty) payload['nop_asal'] = nopAsal;
    }
    
    final nopBersama = _nopBersamaController.text.replaceAll('.', '');
    if (nopBersama.isNotEmpty) payload['nop_bersama'] = nopBersama;
    
    if (_noSpptLamaController.text.isNotEmpty) payload['no_sppt_lama'] = _noSpptLamaController.text;
    
    if (_jenisLayanan == 'HAPUS') {
      payload['catatan_pengaju'] = _alasanHapusController.text;
    } else {
      payload['subjek_pajak'] = {
        'nama': _namaWpController.text,
        'nik': _nikController.text,
        'status_wp': _statusWp,
        'pekerjaan': _pekerjaan,
        if (_npwpController.text.isNotEmpty) 'npwp': _npwpController.text,
        if (_noHpController.text.isNotEmpty) 'no_hp': _noHpController.text,
        'alamat': _alamatWpController.text,
        'rt': _rtController.text,
        'rw': _rwController.text,
        'kelurahan': _kelurahanWpController.text,
        if (_kecamatanWpController.text.isNotEmpty) 'kecamatan': _kecamatanWpController.text,
        'kabupaten': _kabupatenWpController.text,
        if (_kodePosController.text.isNotEmpty) 'kode_pos': _kodePosController.text,
      };
      
      payload['objek_pajak_sementara'] = {
        'jenis_tanah': _jenisTanah,
        'luas_tanah': double.tryParse(_luasTanahController.text) ?? 0.0,
        'jalan_op': _jalanOpController.text,
        if (_blokKavController.text.isNotEmpty) 'blok_kav_no': _blokKavController.text,
        if (_rtOpController.text.isNotEmpty) 'rt_op': _rtOpController.text,
        if (_rwOpController.text.isNotEmpty) 'rw_op': _rwOpController.text,
        'kelurahan_op': _kelurahanOpController.text,
        'kecamatan_op': _kecamatanOpController.text,
        if (_batasUtaraController.text.isNotEmpty) 'batas_utara': _batasUtaraController.text,
        if (_batasSelatanController.text.isNotEmpty) 'batas_selatan': _batasSelatanController.text,
        if (_batasTimurController.text.isNotEmpty) 'batas_timur': _batasTimurController.text,
        if (_batasBaratController.text.isNotEmpty) 'batas_barat': _batasBaratController.text,
        if (_latController.text.isNotEmpty) 'latitude': _latController.text,
        if (_lngController.text.isNotEmpty) 'longitude': _lngController.text,
        if (_polygonPoints.isNotEmpty) 'koordinat_polygon': _polygonPoints.map((p) => {'lat': p.latitude, 'lng': p.longitude}).toList(),
      };
    }
    
    if (_lampiran.isNotEmpty) payload['lampiran'] = _lampiran;
    
    return payload;
  }

  Future<void> _saveDraft() async {
    setState(() => _isSavingDraft = true);
    try {
      final payload = _buildPayload();
      payload['is_draft'] = true;
      await _spopService.saveDraft(payload);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Draft berhasil disimpan!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal simpan draft: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      setState(() => _isSavingDraft = false);
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Periksa kembali isian wajib')));
      return;
    }
    setState(() => _isLoading = true);
    try {
      await _spopService.submitSpop(_buildPayload());
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Formulir SPOP berhasil diajukan ke BKD!'), backgroundColor: Colors.green),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal kirim: $e'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      allowMultiple: false,
    );
    if (result != null && result.files.single.path != null) {
      final file = result.files.single;
      setState(() => _isLoading = true);
      try {
        final url = await _spopService.uploadFile(file.path!, file.name);
        setState(() {
          _lampiran.add({'jenis_dokumen': file.name, 'url_file': url});
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('✅ ${file.name} berhasil diunggah')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal unggah: $e'), backgroundColor: Theme.of(context).colorScheme.error),
          );
        }
      } finally {
        if (mounted) setState(() => _isLoading = false);
      }
    }
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_selectedKategori == 'PENGHAPUSAN') {
        if (_alasanHapusController.text.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alasan Penghapusan wajib diisi')));
          return;
        }
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Melewati form Subjek & Objek Tanah...'), duration: Duration(seconds: 1)),
        );
        setState(() => _currentStep = 3); // Jump to Lampiran
      } else if (_jenisLayanan == 'MUTASI') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Transaksi Mutasi: Melewati form Objek Tanah...'), duration: Duration(seconds: 1)),
        );
        setState(() => _currentStep = 1);
      } else {
        setState(() => _currentStep = 1);
      }
    } else if (_currentStep == 1) {
      if (_jenisLayanan == 'MUTASI') {
        setState(() => _currentStep = 3); // Jump to Lampiran
      } else {
        setState(() => _currentStep = 2);
      }
    } else if (_currentStep == 2) {
      setState(() => _currentStep = 3);
    } else if (_currentStep == 3) {
      setState(() => _currentStep = 4); // Konfirmasi
    } else if (_currentStep == 4) {
      _submitForm();
    }
  }

  void _prevStep() {
    if (_currentStep == 4) {
      setState(() => _currentStep = 3);
    } else if (_currentStep == 3) {
      if (_selectedKategori == 'PENGHAPUSAN') {
        setState(() => _currentStep = 0);
      } else if (_jenisLayanan == 'MUTASI') {
        setState(() => _currentStep = 1);
      } else {
        setState(() => _currentStep = 2);
      }
    } else if (_currentStep == 2) {
      setState(() => _currentStep = 1);
    } else if (_currentStep == 1) {
      setState(() => _currentStep = 0);
    }
  }

  String _getStepTitle() {
    switch (_currentStep) {
      case 0: return 'Data Transaksi (1/5)';
      case 1: return 'Data Subjek Pajak (2/5)';
      case 2: return 'Data Objek Pajak (3/5)';
      case 3: return 'Lampiran Pendukung (4/5)';
      case 4: return 'Konfirmasi Akhir (5/5)';
      default: return '';
    }
  }

  Widget _buildStep0() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Pilih Jenis Transaksi', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 16),
        SelectableCard(
          title: 'Perekaman Baru',
          subtitle: 'Mendaftarkan objek pajak yang belum terdata',
          icon: Icons.add_circle_outline,
          isSelected: _selectedKategori == 'BARU',
          onTap: () => setState(() {
            _selectedKategori = 'BARU';
            _jenisLayanan = 'BARU'; // default Murni
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 12),
        SelectableCard(
          title: 'Pemutakhiran Data',
          subtitle: 'Memperbarui data objek pajak lama',
          icon: Icons.refresh,
          isSelected: _selectedKategori == 'PEMUTAKHIRAN',
          onTap: () => setState(() {
            _selectedKategori = 'PEMUTAKHIRAN';
            _jenisLayanan = 'MUTASI'; // default Mutasi
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 12),
        SelectableCard(
          title: 'Penghapusan Data',
          subtitle: 'Menghapus data objek dari sistem',
          icon: Icons.delete_outline,
          isSelected: _selectedKategori == 'PENGHAPUSAN',
          onTap: () => setState(() {
            _selectedKategori = 'PENGHAPUSAN';
            _jenisLayanan = 'HAPUS';
            _fetchedObjekPajak = null;
          }),
        ),
        const SizedBox(height: 24),
        
        AnimatedSize(
          duration: const Duration(milliseconds: 300),
          child: _buildDynamicFields(),
        ),
      ],
    );
  }

  Widget _buildDynamicFields() {
    if (_selectedKategori == 'BARU') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Kondisi Pendaftaran (Pilih salah satu):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Murni'),
                selected: _jenisLayanan == 'BARU',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'BARU' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) setState(() => _jenisLayanan = 'BARU'); },
              ),
              ChoiceChip(
                label: const Text('Hasil Pemecahan'),
                selected: _jenisLayanan == 'PECAH',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'PECAH' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) setState(() => _jenisLayanan = 'PECAH'); },
              ),
              ChoiceChip(
                label: const Text('Hasil Penggabungan'),
                selected: _jenisLayanan == 'GABUNG',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'GABUNG' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) setState(() => _jenisLayanan = 'GABUNG'); },
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('INFORMASI TAMBAHAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          if (_jenisLayanan == 'PECAH' || _jenisLayanan == 'GABUNG') ...[
            const SizedBox(height: 12),
            const Text('NOP Asal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87)),
            const SizedBox(height: 8),
            ..._nopAsalControllers.asMap().entries.map((entry) {
              int idx = entry.key;
              TextEditingController ctrl = entry.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: CustomTextField(
                        controller: ctrl,
                        label: 'NOP Asal ${idx + 1}',
                        hintText: 'Misal: 33.03.010...',
                        keyboardType: TextInputType.number,
                        inputFormatters: [NopInputFormatter()],
                      ),
                    ),
                    if (_nopAsalControllers.length > 1)
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
                        onPressed: () {
                          setState(() {
                            _nopAsalControllers.removeAt(idx);
                          });
                        },
                      ),
                  ],
                ),
              );
            }),
            TextButton.icon(
              onPressed: () {
                setState(() {
                  _nopAsalControllers.add(TextEditingController());
                });
              },
              icon: const Icon(Icons.add_circle_outline),
              label: const Text('Tambah NOP Asal'),
            ),
          ],
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _noSpptLamaController,
            label: 'NO. SPPT LAMA (Opsional)',
          ),
        ],
      );
    } else if (_selectedKategori == 'PEMUTAKHIRAN') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Jenis Pemutakhiran (Pilih salah satu):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Balik Nama / Jual Beli (Mutasi)'),
                selected: _jenisLayanan == 'MUTASI',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'MUTASI' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) setState(() { _jenisLayanan = 'MUTASI'; _fetchedObjekPajak = null; }); },
              ),
              ChoiceChip(
                label: const Text('Ralat Luas / Alamat (Perubahan Data)'),
                selected: _jenisLayanan == 'PERUBAHAN_DATA',
                selectedColor: const Color(0xFFE8F1F2),
                labelStyle: TextStyle(color: _jenisLayanan == 'PERUBAHAN_DATA' ? const Color(0xFF0F2C59) : Colors.black87),
                onSelected: (val) { if (val) setState(() { _jenisLayanan = 'PERUBAHAN_DATA'; _fetchedObjekPajak = null; }); },
              ),
            ],
          ),
          const SizedBox(height: 24),
          CustomTextField(
            controller: _nopUtamaController,
            label: 'NOP UTAMA',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
            validator: (v) => v!.isEmpty ? 'Wajib diisi' : null,
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _fetchNopData,
              icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.search),
              label: Text(_isLoading ? 'Mencari...' : 'Cari Data Objek Pajak'),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F2C59), foregroundColor: Colors.white),
            ),
          ),
          if (_fetchedObjekPajak != null) ...[
            const SizedBox(height: 16),
            _buildDataPreviewCard(),
          ],
          const SizedBox(height: 24),
          const Text('INFORMASI TAMBAHAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _noSpptLamaController,
            label: 'NO. SPPT LAMA (Opsional)',
          ),
        ],
      );
    } else if (_selectedKategori == 'PENGHAPUSAN') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomTextField(
            controller: _nopUtamaController,
            label: 'NOP UTAMA',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
            validator: (v) => v!.isEmpty ? 'Wajib diisi' : null,
          ),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _nopBersamaController,
            label: 'NOP BERSAMA (Opsional)',
            hintText: 'Masukkan 18 digit NOP',
            keyboardType: TextInputType.number,
            inputFormatters: [NopInputFormatter()],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isLoading ? null : _fetchNopData,
              icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.search),
              label: Text(_isLoading ? 'Mencari...' : 'Cari Data Objek Pajak'),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F2C59), foregroundColor: Colors.white),
            ),
          ),
          if (_fetchedObjekPajak != null) ...[
            const SizedBox(height: 16),
            _buildDataPreviewCard(),
          ],
          const SizedBox(height: 24),
          const Text('ALASAN PENGHAPUSAN', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
          const Divider(),
          const SizedBox(height: 12),
          CustomTextField(
            controller: _alasanHapusController,
            label: 'Tuliskan alasan lengkap mengapa NOP ini diajukan untuk dihapus...',
            maxLines: 4,
          ),
        ],
      );
    }
    return const SizedBox();
  }

  Widget _buildDataPreviewCard() {
    final obj = _fetchedObjekPajak!;
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF1F8F1),
        border: Border.all(color: Colors.green.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.check_circle_outline, color: Colors.green.shade700, size: 20),
              const SizedBox(width: 8),
              Text('Data Objek Pajak Ditemukan', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green.shade800)),
            ],
          ),
          const Divider(),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('NOP', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(_nopUtamaController.text, style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Alamat Objek Pajak', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['jalan_op']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Status', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(4)),
                      child: Text('Aktif', style: TextStyle(fontSize: 12, color: Colors.green.shade800, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Subjek Pajak (NIK)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['subjek_pajak']?['nik']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Luas Tanah / Bangunan', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text('${obj['luas_tanah'] ?? '-'} m² / ${obj['total_luas_bangunan'] ?? obj['luas_bangunan'] ?? '-'} m²', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Jenis Tanah', style: TextStyle(fontSize: 12, color: Colors.grey)),
                    Text(obj['jenis_tanah']?.toString() ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- Skipped Step 1 to 3 code for brevity, will paste them in next ---

  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomTextField(controller: _namaWpController, label: 'Nama Wajib Pajak *', validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _nikController, label: 'NIK (16 digit) *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _npwpController, label: 'NPWP', keyboardType: TextInputType.number)),
        ]),
        const SizedBox(height: 12),
        CustomTextField(controller: _noHpController, label: 'Nomor HP', keyboardType: TextInputType.phone),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _statusWp,
              isExpanded: true,
              decoration: InputDecoration(labelText: 'Status WP', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: _statusWpOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => setState(() => _statusWp = v!),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: DropdownButtonFormField<String>(
              value: _pekerjaan,
              isExpanded: true,
              decoration: InputDecoration(labelText: 'Pekerjaan', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: _pekerjaanOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => setState(() => _pekerjaan = v!),
            ),
          ),
        ]),
        const SizedBox(height: 12),
        CustomTextField(controller: _alamatWpController, label: 'Alamat (Jalan) *', maxLines: 2, validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _rtController, label: 'RT *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
          const SizedBox(width: 8),
          Expanded(child: CustomTextField(controller: _rwController, label: 'RW *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
          const SizedBox(width: 8),
          Expanded(flex: 2, child: CustomTextField(controller: _kelurahanWpController, label: 'Kelurahan *', validator: (v) => v!.isEmpty ? '*' : null)),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _kecamatanWpController, label: 'Kecamatan')),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _kodePosController, label: 'Kode Pos', keyboardType: TextInputType.number)),
        ]),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(children: [
          Expanded(
            flex: 2,
            child: DropdownButtonFormField<String>(
              value: _jenisTanah,
              isExpanded: true,
              decoration: InputDecoration(labelText: 'Jenis Tanah', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12))),
              items: _jenisTanahOptions.map((o) => DropdownMenuItem(value: o['value'], child: Text(o['label']!, style: const TextStyle(fontSize: 14)))).toList(),
              onChanged: (v) => setState(() => _jenisTanah = v!),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _luasTanahController, label: 'Luas (m²) *', keyboardType: TextInputType.number, validator: (v) => v!.isEmpty ? '*' : null)),
        ]),
        const SizedBox(height: 12),
        CustomTextField(controller: _jalanOpController, label: 'Alamat Objek (Jalan) *', maxLines: 2, validator: (v) => v!.isEmpty ? 'Wajib diisi' : null),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _blokKavController, label: 'Blok/Kav/No')),
          const SizedBox(width: 8),
          Expanded(child: CustomTextField(controller: _rtOpController, label: 'RT')),
          const SizedBox(width: 8),
          Expanded(child: CustomTextField(controller: _rwOpController, label: 'RW')),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _kelurahanOpController, label: 'Kelurahan Objek *', validator: (v) => v!.isEmpty ? '*' : null)),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _kecamatanOpController, label: 'Kecamatan Objek *', validator: (v) => v!.isEmpty ? '*' : null)),
        ]),
        const SizedBox(height: 12),
        const Text('Batas-batas Tanah:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: CustomTextField(controller: _batasUtaraController, label: 'Utara')),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _batasSelatanController, label: 'Selatan')),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: CustomTextField(controller: _batasTimurController, label: 'Timur')),
          const SizedBox(width: 12),
          Expanded(child: CustomTextField(controller: _batasBaratController, label: 'Barat')),
        ]),
        const SizedBox(height: 12),
        const Text('Cari Lokasi / Nama Jalan:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _mapSearchController,
                decoration: InputDecoration(
                  hintText: 'Misal: Purbalingga Lor',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                ),
                onSubmitted: (_) => _searchLocation(),
              ),
            ),
            const SizedBox(width: 8),
            ElevatedButton(
              onPressed: _isMapSearching ? null : _searchLocation,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: _isMapSearching ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Cari'),
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
                    initialCenter: const LatLng(-7.3878, 109.3620), // Purbalingga default
                    initialZoom: 15.0,
                    maxZoom: 22.0,
                    onTap: (tapPosition, point) {
                      setState(() {
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
                          )
                        ],
                      ),
                    if (_searchReferencePoint != null)
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: _searchReferencePoint!,
                            width: 40,
                            height: 40,
                            child: const Icon(Icons.location_on, color: Colors.blue, size: 40),
                          )
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
                          )
                        ],
                      ),
                    if (_polygonPoints.isNotEmpty)
                      MarkerLayer(
                        markers: _polygonPoints.map((p) => Marker(
                          point: p,
                          width: 12,
                          height: 12,
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
        const SizedBox(height: 8),
        Row(
          children: [
            ElevatedButton.icon(
              onPressed: _polygonPoints.isEmpty ? null : () => setState(() {
                _polygonPoints.removeLast();
                if (_polygonPoints.isNotEmpty) {
                  _latController.text = _polygonPoints.first.latitude.toString();
                  _lngController.text = _polygonPoints.first.longitude.toString();
                } else {
                  _latController.text = '';
                  _lngController.text = '';
                }
              }),
              icon: const Icon(Icons.undo, size: 18),
              label: const Text('Batal Titik Terakhir'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange.shade50, foregroundColor: Colors.orange.shade800),
            ),
            const SizedBox(width: 8),
            ElevatedButton.icon(
              onPressed: _polygonPoints.isEmpty ? null : () => setState(() {
                _polygonPoints.clear();
                _latController.text = '';
                _lngController.text = '';
              }),
              icon: const Icon(Icons.delete, size: 18),
              label: const Text('Hapus Semua'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade50, foregroundColor: Colors.red),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (_polygonPoints.isNotEmpty) ...[
          const Text('Lihat di Peta Eksternal:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              ElevatedButton.icon(
                onPressed: () async {
                  final url = Uri.parse('https://www.google.com/maps?q=${_latController.text},${_lngController.text}');
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
                  if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Koordinat disalin!'), backgroundColor: Colors.green));
                  final url = Uri.parse('https://bhumi.atrbpn.go.id/peta');
                  if (await canLaunchUrl(url)) await launchUrl(url);
                },
                icon: const Icon(Icons.public, size: 18),
                label: const Text('BHUMI ATR/BPN'),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ] else ...[
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: CustomTextField(controller: _latController, label: 'Latitude')),
            const SizedBox(width: 12),
            Expanded(child: CustomTextField(controller: _lngController, label: 'Longitude')),
          ]),
        ],
      ],
    );
  }

  Widget _buildStep3() {
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
            onPressed: () => setState(() => _lampiran.remove(l)),
          ),
        )),
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: _isLoading ? null : _pickFile,
          icon: _isLoading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.upload_file),
          label: Text(_isLoading ? 'Mengunggah...' : 'Pilih & Unggah Berkas'),
        ),
      ],
    );
  }

  Widget _buildStep4() {
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

  Widget _buildCurrentStepWidget() {
    switch (_currentStep) {
      case 0: return _buildStep0();
      case 1: return _buildStep1();
      case 2: return _buildStep2();
      case 3: return _buildStep3();
      case 4: return _buildStep4();
      default: return const SizedBox();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isLastStep = _currentStep == 4;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC), // Off-White background
      appBar: AppBar(
        title: Text(_getStepTitle(), style: const TextStyle(fontSize: 16)),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F2C59), // Navy Blue
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: _isSavingDraft ? null : _saveDraft,
            icon: _isSavingDraft ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.save_outlined, size: 18),
            label: const Text('Draft'),
            style: TextButton.styleFrom(foregroundColor: const Color(0xFF0F2C59)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            // Linear Progress Indicator
            LinearProgressIndicator(
              value: (_currentStep + 1) / 5,
              backgroundColor: Colors.grey.shade200,
              color: const Color(0xFF0F2C59),
              minHeight: 4,
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 2))],
                  ),
                  child: _buildCurrentStepWidget(),
                ),
              ),
            ),
            
            // Sticky Bottom Footer
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -4))],
              ),
              child: Row(
                children: [
                  if (_currentStep > 0) ...[
                    Expanded(
                      flex: 1,
                      child: OutlinedButton(
                        onPressed: _prevStep,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          foregroundColor: const Color(0xFF0F2C59),
                          side: const BorderSide(color: Color(0xFF0F2C59)),
                        ),
                        child: const Text('Kembali'),
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: (_isLoading || _isSavingDraft) ? null : _nextStep,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: const Color(0xFF0F2C59),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isLoading 
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(
                            isLastStep ? 'Simpan & Ajukan' : (_selectedKategori == 'PENGHAPUSAN' && _currentStep == 0 ? 'Lanjut Konfirmasi Penghapusan' : 'Selanjutnya'),
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

