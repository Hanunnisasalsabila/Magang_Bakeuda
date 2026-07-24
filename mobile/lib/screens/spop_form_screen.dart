import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:dio/dio.dart';
import 'package:geolocator/geolocator.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_dropdown.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/transaksi_spop_service.dart';
import '../utils/formatters.dart';
import '../widgets/selectable_card.dart';
import '../utils/constants.dart';
import '../utils/wilayah_data.dart';

part 'spop_steps/step0_layanan.dart';
part 'spop_steps/step1_subjek.dart';
part 'spop_steps/step2_objek.dart';
part 'spop_steps/step3_bangunan.dart';
part 'spop_steps/step4_lampiran.dart';
part 'spop_steps/step5_konfirmasi.dart';
part 'spop_steps/step_pecahan.dart';

class SpopFormScreen extends StatefulWidget {
  final String? idTransaksi;
  const SpopFormScreen({super.key, this.idTransaksi});

  @override
  State<SpopFormScreen> createState() => _SpopFormScreenState();
}

class _SpopFormScreenState extends State<SpopFormScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  final _authService = AuthService();
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isSavingDraft = false;
  bool _isOpWilayahPatented = false;
  Map<String, dynamic>? _fetchedObjekPajak;
  String _selectedJenisDokumen = 'KTP';
  String? _transaksiId;

  // ── PECAH mode state ──
  bool _isPecahMode = false;
  int _currentPecahanIdx = 1;     // 1-based
  int _pecahanSubStep = 0;        // 0=Subjek, 1=Objek, 2=Bangunan, 3=Lampiran
  int _currentPecahanBangunanIdx = 1;
  int _jumlahPecahan = 2;         // minimum 2
  List<Map<String, dynamic>> _pecahanList = [];
  void updateFormState(VoidCallback fn) {
    if (mounted) {
      setState(fn);
    }
  }

  List<String> get _kecamatans => WilayahData.data.map((e) => e['kecamatan']!).toSet().toList()..sort();

  String? _getValidKecamatan(String input) {
    if (input.isEmpty) return null;
    final match = WilayahData.data.where((e) => e['kecamatan']?.toUpperCase() == input.toUpperCase());
    return match.isNotEmpty ? match.first['kecamatan'] : null;
  }

  String? _getValidKelurahan(String kecInput, String kelInput) {
    if (kecInput.isEmpty || kelInput.isEmpty) return null;
    final validKec = _getValidKecamatan(kecInput);
    if (validKec == null) return null;
    final match = WilayahData.data.where((e) => e['kecamatan'] == validKec && e['nama_desa']?.toUpperCase() == kelInput.toUpperCase());
    return match.isNotEmpty ? match.first['nama_desa'] : null;
  }

  // Step 1 - Kategori & Jenis
  String _selectedKategori = ''; // BARU, PEMUTAKHIRAN, PENGHAPUSAN
  String _jenisLayanan = ''; // BARU, PECAH, GABUNG, MUTASI, PERUBAHAN_DATA, HAPUS
  
  final _nopUtamaController = TextEditingController();
  final List<TextEditingController> _nopAsalControllers = [TextEditingController()];
  final _nopBersamaController = TextEditingController();
  final _noSpptLamaController = TextEditingController();
  final _alasanHapusController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _loadUserProfile();
    if (widget.idTransaksi != null) {
      _loadDraftData();
    }
  }

  Future<void> _loadUserProfile() async {
    final res = await _authService.getProfile();
    if (res['success'] == true) {
      final data = res['data'];
      if (data['kode_wilayah'] != null && data['kode_wilayah'].toString().isNotEmpty) {
        final kode = data['kode_wilayah'].toString();
        final match = WilayahData.data.where((w) => w['kode_wilayah'] == kode);
        if (match.isNotEmpty) {
          final w = match.first;
          updateFormState(() {
            _kecamatanOpController.text = w['kecamatan'] ?? '';
            _kelurahanOpController.text = w['nama_desa'] ?? '';
            _isOpWilayahPatented = true;
          });
        }
      }
    }
  }

  Future<void> _loadDraftData() async {
    setState(() => _isLoading = true);
    try {
      final d = await _spopService.getDetailTransaksi(widget.idTransaksi!);
      setState(() {
        _jenisLayanan = d['jenis_transaksi'] ?? 'BARU';
        _menggunakanKuasa = d['menggunakan_kuasa'] ?? false;
        
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
           if (_jenisLayanan == 'PECAH') {
             _isPecahMode = true;
             _jumlahPecahan = tujuanList.length;
             _pecahanList.clear();
             for (var t in tujuanList) {
               final subjek = t['calon_subjek_json'] ?? {};
               final bng = t['data_bangunan_json'] as List? ?? [];
               _pecahanList.add({
                  'namaWp': subjek['nama_subjek'] ?? '',
                  'nik': subjek['nik'] ?? '',
                  'statusWp': subjek['status_wp'] ?? 'PEMILIK',
                  'pekerjaan': subjek['pekerjaan'] ?? 'LAINNYA',
                  'npwp': subjek['npwp'] ?? '',
                  'noHp': subjek['no_hp'] ?? '',
                  'alamatWp': subjek['alamat_jalan'] ?? '',
                  'rt': subjek['rt'] ?? '',
                  'rw': subjek['rw'] ?? '',
                  'kelurahan': subjek['kelurahan'] ?? '',
                  'kecamatan': subjek['kecamatan'] ?? '',
                  'kabupaten': subjek['kabupaten'] ?? 'Purbalingga',
                  'kodePos': subjek['kode_pos'] ?? '',
                  
                  'luasTanah': t['luas_tanah_baru']?.toString() ?? '',
                  'jenisTanah': t['jenis_tanah_baru'] ?? 'TANAH_BANGUNAN',
                  'jalanOp': t['jalan_op_baru'] ?? '',
                  'blokKav': t['blok_kav_no_baru'] ?? '',
                  'rtOp': t['rt_op_baru'] ?? '',
                  'rwOp': t['rw_op_baru'] ?? '',
                  'kelurahanOp': (t['kelurahan_op_baru']?.toString().isNotEmpty == true) ? t['kelurahan_op_baru'] : (_isOpWilayahPatented ? _kelurahanOpController.text : ''),
                  'kecamatanOp': (t['kecamatan_op_baru']?.toString().isNotEmpty == true) ? t['kecamatan_op_baru'] : (_isOpWilayahPatented ? _kecamatanOpController.text : ''),
                  'batasUtara': t['batas_utara'] ?? '',
                  'batasSelatan': t['batas_selatan'] ?? '',
                  'batasTimur': t['batas_timur'] ?? '',
                  'batasBarat': t['batas_barat'] ?? '',
                  'lat': t['latitude']?.toString() ?? '-7.3934',
                  'lng': t['longitude']?.toString() ?? '109.3663',
                  'koordinatPolygon': t['koordinat_polygon'] ?? <Map<String, double>>[],
                  'jumlahBangunan': t['jumlah_bangunan_baru']?.toString() ?? bng.length.toString(),
                  'dataBangunan': List<Map<String, dynamic>>.from(bng.map((e) => Map<String, dynamic>.from(e as Map))),
                  'lampiran': <Map<String, dynamic>>[],
                  'selectedJenisDokumen': 'KTP',
               });
             }
           } else {
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
             final kelOpB = tujuan['kelurahan_op_baru']?.toString();
             final kecOpB = tujuan['kecamatan_op_baru']?.toString();
             _kelurahanOpController.text = (kelOpB != null && kelOpB.isNotEmpty) ? kelOpB : (_isOpWilayahPatented ? _kelurahanOpController.text : '');
             _kecamatanOpController.text = (kecOpB != null && kecOpB.isNotEmpty) ? kecOpB : (_isOpWilayahPatented ? _kecamatanOpController.text : '');
             
             _jmlBangunanController.text = tujuan['jumlah_bangunan_baru']?.toString() ?? '0';
             final bngList = tujuan['data_bangunan_json'];
             if (bngList != null && bngList is List) {
                _dataBangunanList = List<Map<String, dynamic>>.from(
                    bngList.map((e) => Map<String, dynamic>.from(e as Map))
                );
             }
           }
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
  bool _menggunakanKuasa = false;
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
    {'label': 'TNI/Polri', 'value': 'ABRI'},
    {'label': 'Pensiunan', 'value': 'PENSIUNAN'},
    {'label': 'Badan', 'value': 'BADAN'},
    {'label': 'Lainnya', 'value': 'LAINNYA'},
  ];

  // Step 3 - Data Objek Pajak
  String _jenisTanah = 'TANAH_BANGUNAN';
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
  final _jmlBangunanController = TextEditingController(text: '1');

  // Step 3 - Data Bangunan (Multi-bangunan)
  int _currentBangunanIndex = 1;
  List<Map<String, dynamic>> _dataBangunanList = [];

  /// Initialize the main bangunan list for non-PECAH transactions
  void _initBangunanList(int count) {
    if (_dataBangunanList.length != count) {
      _dataBangunanList = List.generate(count, (index) => {
        'jenisPenggunaan': Constants.jenisPenggunaanBangunan[0],
        'luasBangunan': '',
        'jumlahLantai': '',
        'tahunDibangun': '',
        'kondisi': Constants.kondisiBangunan[0],
        'konstruksi': Constants.konstruksiBangunan[0],
        'atap': Constants.atapBangunan[0],
        'dinding': Constants.dindingBangunan[0],
        'lantai': Constants.lantaiBangunan[0],
        'langitLangit': Constants.langitLangitBangunan[0],
      });
      _currentBangunanIndex = 1;
    }
  }

  /// Initialize the pecahan list with [count] empty entries
  void _initPecahanList(int count) {
    while (_pecahanList.length < count) {
      _pecahanList.add({
        'namaWp': '', 'nik': '', 'statusWp': 'PEMILIK', 'pekerjaan': 'LAINNYA',
        'npwp': '', 'noHp': '', 'alamatWp': '', 'rt': '', 'rw': '',
        'kelurahan': '', 'kecamatan': '', 'kabupaten': 'Purbalingga', 'kodePos': '',
        'luasTanah': '', 'jenisTanah': 'TANAH_BANGUNAN', 'jalanOp': '',
        'blokKav': '', 'rtOp': '', 'rwOp': '', 'kelurahanOp': _isOpWilayahPatented ? _kelurahanOpController.text : '',
        'kecamatanOp': _isOpWilayahPatented ? _kecamatanOpController.text : '', 'batasUtara': '', 'batasSelatan': '',
        'batasTimur': '', 'batasBarat': '', 'lat': '-7.3934', 'lng': '109.3663',
        'koordinatPolygon': <Map<String, double>>[],
        'jumlahBangunan': '0',
        'dataBangunan': <Map<String, dynamic>>[],
        'lampiran': <Map<String, dynamic>>[],
        'selectedJenisDokumen': 'KTP',
      });
    }
    if (_pecahanList.length > count) {
      _pecahanList = _pecahanList.sublist(0, count);
    }
  }

  /// Initialize bangunan data for a specific pecahan
  void _initPecahanBangunanData(int pecahanIdx, int count) {
    final currentList = List<Map<String, dynamic>>.from(
      (_pecahanList[pecahanIdx]['dataBangunan'] as List).map((e) => Map<String, dynamic>.from(e as Map))
    );
    while (currentList.length < count) {
      currentList.add({
        'jenisPenggunaan': Constants.jenisPenggunaanBangunan[0],
        'luasBangunan': '', 'jumlahLantai': '', 'tahunDibangun': '',
        'tahunDirenovasi': '', 'dayaListrik': '',
        'kondisi': Constants.kondisiBangunan[0],
        'konstruksi': Constants.konstruksiBangunan[0],
        'atap': Constants.atapBangunan[0],
        'dinding': Constants.dindingBangunan[0],
        'lantai': Constants.lantaiBangunan[0],
        'langitLangit': Constants.langitLangitBangunan[0],
        'hasAC': false, 'acSplit': '', 'acWindow': '', 'acSentral': 'Tidak Ada',
        'hasKolamRenang': false, 'kolamRenangLuas': '', 'kolamRenangFinishing': 'Diplester',
        'hasPagar': false, 'panjangPagar': '', 'bahanPagar': 'Bata/Batako',
        'hasHalaman': false, 'halamanRingan': '', 'halamanSedang': '', 'halamanBerat': '', 'halamanPenutupLantai': '',
        'hasLift': false, 'liftPenumpang': '', 'liftKapsul': '', 'liftBarang': '', 'tanggaBerjalanKecil': '', 'tanggaBerjalanBesar': '',
        'hasPemadam': false, 'pemadamHydrant': 'Tidak Ada', 'pemadamSprinkler': 'Tidak Ada', 'pemadamFireAl': 'Tidak Ada',
        'hasTenis': false,
        'lapanganTenisLampuBeton': '', 'lapanganTenisLampuAspal': '', 'lapanganTenisLampuTanah': '',
        'lapanganTenisTanpaLampuBeton': '', 'lapanganTenisTanpaLampuAspal': '', 'lapanganTenisTanpaLampuTanah': '',
        'hasLain': false, 'saluranPabx': '', 'sumurArtesis': '',
      });
    }
    setState(() {
      _pecahanList[pecahanIdx]['dataBangunan'] = currentList.sublist(0, count);
    });
  }

  final List<Map<String, String>> _jenisTanahOptions = [
    {'label': 'Tanah + Bangunan', 'value': 'TANAH_BANGUNAN'},
    {'label': 'Kavling Siap Bangun', 'value': 'KAVLING_SIAP_BANGUN'},
    {'label': 'Tanah Kosong', 'value': 'TANAH_KOSONG'},
    {'label': 'Fasilitas Umum', 'value': 'FASILITAS_UMUM'},
    {'label': 'Lainnya', 'value': 'TANAH_LAINNYA'},
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

          if (obj['bangunan'] != null && obj['bangunan'] is List) {
             final listB = obj['bangunan'] as List;
             _jmlBangunanController.text = listB.length.toString();
             _dataBangunanList = listB.map<Map<String, dynamic>>((b) => {
                'jenisPenggunaan': b['jenis_penggunaan'] ?? Constants.jenisPenggunaanBangunan[0],
                'luasBangunan': b['luas_bangunan']?.toString() ?? '',
                'jumlahLantai': b['jumlah_lantai']?.toString() ?? '',
                'tahunDibangun': b['tahun_dibangun']?.toString() ?? '',
                'kondisi': b['kondisi'] ?? Constants.kondisiBangunan[0],
                'konstruksi': b['konstruksi'] ?? Constants.konstruksiBangunan[0],
                'atap': b['atap'] ?? Constants.atapBangunan[0],
                'dinding': b['dinding'] ?? Constants.dindingBangunan[0],
                'lantai': b['lantai'] ?? Constants.lantaiBangunan[0],
                'langitLangit': b['langit_langit'] ?? Constants.langitLangitBangunan[0],
                'dayaListrik': b['daya_listrik_watt']?.toString() ?? '900',
             }).toList();
          } else if (_jenisTanah != 'TANAH_KOSONG') {
             _jmlBangunanController.text = '0';
             _dataBangunanList = [];
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

  Future<void> _prefillGabungDataAndNext() async {
    final firstNop = _nopAsalControllers.isNotEmpty ? _nopAsalControllers[0].text.replaceAll('.', '').trim() : '';
    if (firstNop.length < 18) {
       setState(() => _currentStep = 1);
       return;
    }

    setState(() => _isLoading = true);
    try {
      final obj = await _spopService.getObjekPajakByNop(firstNop);
      if (obj != null) {
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
          
          if (obj['nama_wp'] != null) _namaWpController.text = obj['nama_wp'].toString();
          if (obj['jalan_wp'] != null) _alamatWpController.text = obj['jalan_wp'].toString();
          if (obj['rt_wp'] != null) _rtController.text = obj['rt_wp'].toString();
          if (obj['rw_wp'] != null) _rwController.text = obj['rw_wp'].toString();
          
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
            const SnackBar(content: Text('✅ Data berhasil di-prefill dari NOP Asal pertama'), backgroundColor: Colors.green),
          );
        }
      }
    } catch (e) {
      debugPrint('Prefill error: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _currentStep = 1;
        });
      }
    }
  }

  Map<String, dynamic> _buildPayload() {
    // Use _jenisLayanan (BARU/PECAH/GABUNG/MUTASI/PERUBAHAN_DATA/HAPUS) — NOT _selectedKategori
    final jenis = _jenisLayanan;
    final isHapus = jenis == 'HAPUS';
    final isMutasi = jenis == 'MUTASI';
    final isPerubahanData = jenis == 'PERUBAHAN_DATA';
    final isPecah = jenis == 'PECAH';

    final nop = _nopUtamaController.text.replaceAll('.', '');
    final nopBersama = _nopBersamaController.text.replaceAll('.', '');

    // ─── PECAH: special payload ───
    if (isPecah) {
      final nopAsalPecah = _nopAsalControllers[0].text.replaceAll('.', '');
      final detailAsal = nopAsalPecah.length >= 18
          ? [{'nop_asal': nopAsalPecah, 'nonaktifkan_saat_disetujui': true}]
          : <Map<String, dynamic>>[];

      final detailTujuan = _pecahanList.map((p) {
        double luasBngTotal = 0.0;
        final dataBng = List<Map<String, dynamic>>.from(
          (p['dataBangunan'] as List).map((e) => Map<String, dynamic>.from(e as Map))
        );
        for (var b in dataBng) {
          luasBngTotal += double.tryParse(b['luasBangunan']?.toString() ?? '0') ?? 0;
        }
        final jmlBng = int.tryParse(p['jumlahBangunan']?.toString() ?? '0') ?? 0;

        return <String, dynamic>{
          'calon_subjek_json': {
            'nik': (p['nik'] as String).isEmpty ? '0000000000000000' : p['nik'],
            'nama_subjek': (p['namaWp'] as String).isEmpty ? 'TANPA NAMA' : p['namaWp'],
            'status_wp': p['statusWp'] ?? 'PEMILIK',
            'pekerjaan': p['pekerjaan'] ?? 'LAINNYA',
            'alamat_jalan': (p['alamatWp'] as String).isEmpty ? 'TANPA ALAMAT' : p['alamatWp'],
            if ((p['rt'] as String).isNotEmpty) 'rt': p['rt'],
            if ((p['rw'] as String).isNotEmpty) 'rw': p['rw'],
            'kelurahan': p['kelurahan'],
            'kabupaten': p['kabupaten'] ?? 'Purbalingga',
            if ((p['kecamatan'] as String).isNotEmpty) 'kecamatan': p['kecamatan'],
            if ((p['npwp'] as String).isNotEmpty) 'npwp': p['npwp'],
            if ((p['noHp'] as String).isNotEmpty) 'no_hp': p['noHp'],
            if ((p['kodePos'] as String).isNotEmpty) 'kode_pos': p['kodePos'],
          },
          'luas_tanah_baru': double.tryParse(p['luasTanah']?.toString() ?? '0') ?? 0.0,
          'luas_bangunan_baru': luasBngTotal,
          'jumlah_bangunan_baru': jmlBng,
          'jenis_tanah_baru': p['jenisTanah'] ?? 'TANAH_BANGUNAN',
          'jalan_op_baru': p['jalanOp'] ?? '',
          if ((p['blokKav'] as String).isNotEmpty) 'blok_kav_no_baru': p['blokKav'],
          if ((p['rtOp'] as String).isNotEmpty) 'rt_op_baru': p['rtOp'],
          if ((p['rwOp'] as String).isNotEmpty) 'rw_op_baru': p['rwOp'],
          'kelurahan_op_baru': p['kelurahanOp'] ?? '',
          'kecamatan_op_baru': p['kecamatanOp'] ?? '',
          if ((p['batasUtara'] as String).isNotEmpty) 'batas_utara': p['batasUtara'],
          if ((p['batasSelatan'] as String).isNotEmpty) 'batas_selatan': p['batasSelatan'],
          if ((p['batasTimur'] as String).isNotEmpty) 'batas_timur': p['batasTimur'],
          if ((p['batasBarat'] as String).isNotEmpty) 'batas_barat': p['batasBarat'],
          if ((p['lat'] as String).isNotEmpty) 'latitude': p['lat'],
          if ((p['lng'] as String).isNotEmpty) 'longitude': p['lng'],
          if ((p['koordinatPolygon'] as List).isNotEmpty) 'koordinat_polygon': p['koordinatPolygon'],
          if (dataBng.isNotEmpty) 'data_bangunan_json': dataBng,
        };
      }).toList();

      // Lampiran per-pecahan dengan prefix "PECAHAN_N::"
      final payloadLampiran = {
        'url_ktp': <String>[], 'url_sertifikat': <String>[], 'url_ajb': <String>[],
        'url_imb': <String>[], 'url_pendukung_lokasi': <String>[], 'url_surat_kuasa': <String>[],
      };
      for (int i = 0; i < _pecahanList.length; i++) {
        final pecahanLmp = List<Map<String, dynamic>>.from(
          (_pecahanList[i]['lampiran'] as List).map((e) => Map<String, dynamic>.from(e as Map))
        );
        for (var l in pecahanLmp) {
          final url = 'PECAHAN_${i + 1}::${l['url_file']}';
          final jD = l['jenis_dokumen'] as String;
          if (jD == 'KTP') {
            payloadLampiran['url_ktp']!.add(url);
          } else if (jD == 'Sertifikat Hak Milik') {
            payloadLampiran['url_sertifikat']!.add(url);
          } else if (jD == 'Akte Jual Beli') {
            payloadLampiran['url_ajb']!.add(url);
          } else if (jD == 'Izin Mendirikan Bangunan') {
            payloadLampiran['url_imb']!.add(url);
          } else if (jD == 'Surat Kuasa') {
            payloadLampiran['url_surat_kuasa']!.add(url);
          } else {
            payloadLampiran['url_pendukung_lokasi']!.add(url);
          }
        }
      }

      return <String, dynamic>{
        'jenis_transaksi': 'PECAH',
        'tahun_pajak': DateTime.now().year,
        'tanggal_pengajuan': DateTime.now().toIso8601String(),
        'nama_pengaju': _pecahanList.isNotEmpty ? (_pecahanList[0]['namaWp'] ?? 'TANPA NAMA') : 'TANPA NAMA',
        'menggunakan_kuasa': _menggunakanKuasa,
        if (nopBersama.length >= 18) 'nop_bersama': nopBersama,
        if (_noSpptLamaController.text.isNotEmpty) 'no_sppt_lama': _noSpptLamaController.text,
        if (detailAsal.isNotEmpty) 'detail_asal': detailAsal,
        'detail_tujuan': detailTujuan,
        'lampiran': payloadLampiran,
      };
    }

    // ─── Non-PECAH transactions ───
    final nopAsalList = _nopAsalControllers
        .map((c) => c.text.replaceAll('.', '').trim())
        .where((e) => e.length == 18)
        .toList();

    final detailAsal = nopAsalList.map((n) => {
      'nop_asal': n,
      'nonaktifkan_saat_disetujui': true
    }).toList();

    // For MUTASI/PERUBAHAN_DATA/HAPUS with a single target NOP
    if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].contains(jenis) && nop.length >= 18 && detailAsal.isEmpty) {
      detailAsal.add({'nop_asal': nop, 'nonaktifkan_saat_disetujui': isHapus});
    }

    final calonSubjekJson = {
      'nik': _nikController.text.isEmpty ? '0000000000000000' : _nikController.text,
      'nama_subjek': _namaWpController.text.isEmpty ? 'TANPA NAMA' : _namaWpController.text,
      if (_npwpController.text.isNotEmpty) 'npwp': _npwpController.text,
      if (_noHpController.text.isNotEmpty) 'no_hp': _noHpController.text,
      'status_wp': _statusWp,
      'pekerjaan': _pekerjaan,
      'alamat_jalan': _alamatWpController.text.isEmpty ? 'TANPA ALAMAT' : _alamatWpController.text,
      if (_rtController.text.isNotEmpty) 'rt': _rtController.text,
      if (_rwController.text.isNotEmpty) 'rw': _rwController.text,
      'kelurahan': _kelurahanWpController.text,
      'kabupaten': _kabupatenWpController.text.isEmpty ? 'Purbalingga' : _kabupatenWpController.text,
      if (_kecamatanWpController.text.isNotEmpty) 'kecamatan': _kecamatanWpController.text,
      if (_kodePosController.text.isNotEmpty) 'kode_pos': _kodePosController.text,
    };

    List<Map<String, dynamic>>? detailTujuan;
    if (isHapus) {
      detailTujuan = null;
    } else if (isMutasi) {
      detailTujuan = [{
        'nik_calon_subjek': _nikController.text,
        'calon_subjek_json': calonSubjekJson,
        'luas_tanah_baru': 0,
      }];
    } else {
      double luasBngTotal = 0.0;
      int jmlBangunan = int.tryParse(_jmlBangunanController.text) ?? 0;
      if (jmlBangunan > 0 && _dataBangunanList.isNotEmpty) {
        for (var b in _dataBangunanList) {
          luasBngTotal += double.tryParse(b['luasBangunan']?.toString() ?? '0') ?? 0;
        }
      }
      // For GABUNG, luas_tanah_baru = 0 (backend auto-sums from NOP asal)
      final luasTanah = jenis == 'GABUNG' ? 0.0 : (double.tryParse(_luasTanahController.text) ?? 0.0);

      detailTujuan = [{
        if (!isPerubahanData) 'nik_calon_subjek': _nikController.text,
        if (!isPerubahanData) 'calon_subjek_json': calonSubjekJson,
        if (isPerubahanData && nop.length >= 18) 'nop_generated': nop,
        'luas_tanah_baru': luasTanah,
        'luas_bangunan_baru': luasBngTotal,
        'jumlah_bangunan_baru': jmlBangunan,
        'jenis_tanah_baru': _jenisTanah == 'TANAH_DAN_BANGUNAN' ? 'TANAH_BANGUNAN' : _jenisTanah,
        'jalan_op_baru': _jalanOpController.text,
        if (_blokKavController.text.isNotEmpty) 'blok_kav_no_baru': _blokKavController.text,
        if (_rtOpController.text.isNotEmpty) 'rt_op_baru': _rtOpController.text,
        if (_rwOpController.text.isNotEmpty) 'rw_op_baru': _rwOpController.text,
        'kelurahan_op_baru': _kelurahanOpController.text,
        'kecamatan_op_baru': _kecamatanOpController.text,
        if (_batasUtaraController.text.isNotEmpty) 'batas_utara': _batasUtaraController.text,
        if (_batasSelatanController.text.isNotEmpty) 'batas_selatan': _batasSelatanController.text,
        if (_batasTimurController.text.isNotEmpty) 'batas_timur': _batasTimurController.text,
        if (_batasBaratController.text.isNotEmpty) 'batas_barat': _batasBaratController.text,
        if (_latController.text.isNotEmpty) 'latitude': _latController.text,
        if (_lngController.text.isNotEmpty) 'longitude': _lngController.text,
        if (_polygonPoints.isNotEmpty) 'koordinat_polygon': _polygonPoints.map((p) => {'lat': p.latitude, 'lng': p.longitude}).toList(),
        if (_dataBangunanList.isNotEmpty) 'data_bangunan_json': _dataBangunanList,
      }];
    }

    final payloadLampiran = {
      'url_ktp': <String>[], 'url_sertifikat': <String>[], 'url_ajb': <String>[],
      'url_imb': <String>[], 'url_pendukung_lokasi': <String>[], 'url_surat_kuasa': <String>[],
    };
    for (var l in _lampiran) {
      final docUrl = l['url_file'] as String;
      final jD = l['jenis_dokumen'] as String;
      if (jD == 'KTP') {
        payloadLampiran['url_ktp']!.add(docUrl);
      } else if (jD == 'Sertifikat Hak Milik') {
        payloadLampiran['url_sertifikat']!.add(docUrl);
      } else if (jD == 'Akte Jual Beli') {
        payloadLampiran['url_ajb']!.add(docUrl);
      } else if (jD == 'Izin Mendirikan Bangunan') {
        payloadLampiran['url_imb']!.add(docUrl);
      } else if (jD == 'Surat Kuasa') {
        payloadLampiran['url_surat_kuasa']!.add(docUrl);
      } else {
        payloadLampiran['url_pendukung_lokasi']!.add(docUrl);
      }
    }

    return <String, dynamic>{
      'jenis_transaksi': jenis,
      'tahun_pajak': DateTime.now().year,
      'tanggal_pengajuan': DateTime.now().toIso8601String(),
      if (_alasanHapusController.text.isNotEmpty) 'catatan_pengaju': _alasanHapusController.text,
      'nama_pengaju': _namaWpController.text.isEmpty ? 'TANPA NAMA' : _namaWpController.text,
      'menggunakan_kuasa': _menggunakanKuasa,
      if (nopBersama.length >= 18) 'nop_bersama': nopBersama,
      if (_noSpptLamaController.text.isNotEmpty) 'no_sppt_lama': _noSpptLamaController.text,
      if (detailAsal.isNotEmpty) 'detail_asal': detailAsal,
      // ignore: use_null_aware_elements
      if (detailTujuan != null) 'detail_tujuan': detailTujuan,
      'lampiran': payloadLampiran,
    };
  }

  Future<void> _saveDraft() async {
    setState(() => _isSavingDraft = true);
    try {
      final payload = _buildPayload();
      final resp = await _spopService.saveDraft(payload, existingId: _transaksiId);
      if (resp['data'] != null && resp['data']['id_transaksi'] != null) {
        _transaksiId = resp['data']['id_transaksi'];
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Draft berhasil disimpan!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        String msg = e.toString();
        if (e is DioException && e.response?.data != null) {
          final data = e.response!.data;
          final m = data['message'] ?? data.toString();
          msg = m is List ? m.join(', ') : m.toString();
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal simpan draft: $msg'), backgroundColor: Theme.of(context).colorScheme.error),
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
      final payload = _buildPayload();
      
      // Simpan/update draft terlebih dahulu
      final draftResp = await _spopService.saveDraft(payload, existingId: _transaksiId);
      final idTransaksi = draftResp['data']['id_transaksi'];
      _transaksiId = idTransaksi;
      
      // Finalisasi submit (DRAFT -> MENUNGGU)
      await _spopService.submitDraft(idTransaksi);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Formulir SPOP berhasil diajukan ke BKD!'), backgroundColor: Colors.green),
        );
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        String msg = e.toString();
        if (e is DioException && e.response?.data != null) {
          final data = e.response!.data;
          final m = data['message'] ?? data.toString();
          msg = m is List ? m.join(', ') : m.toString();
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal kirim: $msg'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _pickFile([String? forcedJenisDokumen]) async {
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
          _lampiran.add({'jenis_dokumen': forcedJenisDokumen ?? _selectedJenisDokumen, 'url_file': url});
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

  Future<void> _nextStep() async {
    if (_isPecahMode) { _nextPecahanStep(); return; }

    if (_currentStep < 4 && !_isPecahMode) {
      if (!_formKey.currentState!.validate()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Mohon lengkapi/perbaiki form'), backgroundColor: Colors.red),
        );
        return;
      }
    }

    if (_currentStep == 0) {
      if (_selectedKategori.isEmpty || _jenisLayanan.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Silakan pilih jenis transaksi terlebih dahulu'), backgroundColor: Colors.orange,
        ));
        return;
      }

      if (_jenisLayanan == 'PECAH') {
        // Validate NOP Asal
        final nopAsal = _nopAsalControllers[0].text.replaceAll('.', '');
        if (nopAsal.length < 18) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('NOP Asal harus 18 digit'), backgroundColor: Colors.orange,
          ));
          return;
        }
        if (_jumlahPecahan < 2) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Jumlah pecahan minimal 2'), backgroundColor: Colors.orange,
          ));
          return;
        }

        setState(() => _isLoading = true);
        try {
          final obj = await _spopService.getObjekPajakByNop(nopAsal);
          if (obj == null) {
            if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('NOP Asal tidak ditemukan di server'), backgroundColor: Colors.orange));
            return;
          }
          if (obj['luas_tanah'] != null) {
            _luasTanahController.text = obj['luas_tanah'].toString();
          }
        } catch (e) {
           if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal mengambil data NOP Asal: $e'), backgroundColor: Colors.red));
           return;
        } finally {
          if (mounted) setState(() => _isLoading = false);
        }

        _initPecahanList(_jumlahPecahan);
        setState(() {
          _isPecahMode = true;
          _currentPecahanIdx = 1;
          _pecahanSubStep = 0;
          _currentPecahanBangunanIdx = 1;
        });
      } else if (_jenisLayanan == 'GABUNG') {
        final validNops = _nopAsalControllers
            .where((c) => c.text.replaceAll('.', '').length == 18).length;
        if (validNops < 2) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Minimal 2 NOP Asal 18-digit untuk GABUNG'), backgroundColor: Colors.orange,
          ));
          return;
        }
        _prefillGabungDataAndNext();
      } else if (_jenisLayanan == 'MUTASI' || _jenisLayanan == 'PERUBAHAN_DATA' || _jenisLayanan == 'HAPUS') {
        if (_fetchedObjekPajak == null) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Silakan cari data NOP Utama terlebih dahulu'), backgroundColor: Colors.orange,
          ));
          return;
        }
        if (_jenisLayanan == 'HAPUS' && _alasanHapusController.text.trim().isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alasan Penghapusan wajib diisi')));
          return;
        }
        int nextStep = 1;
        if (_jenisLayanan == 'HAPUS') nextStep = 5;
        if (_jenisLayanan == 'PERUBAHAN_DATA') nextStep = 2;
        setState(() => _currentStep = nextStep);
      } else {
        setState(() => _currentStep = 1);
      }
    } else if (_currentStep == 1) {
      if (_jenisLayanan == 'MUTASI') {
        setState(() => _currentStep = 4);
      } else {
        setState(() => _currentStep = 2);
      }
    } else if (_currentStep == 2) {
      int jmlBangunan = int.tryParse(_jmlBangunanController.text) ?? 0;
      if (jmlBangunan > 0) {
        _initBangunanList(jmlBangunan);
        setState(() => _currentStep = 3);
      } else {
        setState(() => _currentStep = 4);
      }
    } else if (_currentStep == 3) {
      int jmlBangunan = int.tryParse(_jmlBangunanController.text) ?? 0;
      if (_currentBangunanIndex < jmlBangunan) {
        setState(() => _currentBangunanIndex++);
      } else {
        setState(() => _currentStep = 4);
      }
    } else if (_currentStep == 4) {
      if (_menggunakanKuasa && !_lampiran.any((l) => l['jenis_dokumen'] == 'Surat Kuasa')) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Anda bertindak selaku kuasa, wajib melampirkan Surat Kuasa'), backgroundColor: Colors.orange));
        return;
      }
      setState(() => _currentStep = 5);
    } else if (_currentStep == 5) {
      _submitForm();
    }
  }

  void _nextPecahanStep() {
    final p = _pecahanList[_currentPecahanIdx - 1];
    final jmlBng = int.tryParse(p['jumlahBangunan']?.toString() ?? '0') ?? 0;

    if (_pecahanSubStep == 3 && _currentPecahanIdx == _jumlahPecahan) {
      double totalLuas = 0;
      for (var pecahan in _pecahanList) {
        totalLuas += double.tryParse(pecahan['luasTanah']?.toString() ?? '0') ?? 0;
      }
      double luasInduk = double.tryParse(_luasTanahController.text) ?? 0;
      
      if (totalLuas > luasInduk) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Total luas tanah pecahan ($totalLuas m²) melebihi luas induk ($luasInduk m²).'),
            backgroundColor: Theme.of(context).colorScheme.error,
            duration: const Duration(seconds: 4),
          )
        );
        return; 
      }
    }

    setState(() {
      if (_pecahanSubStep == 0) {
        _pecahanSubStep = 1;
      } else if (_pecahanSubStep == 1) {
        if (jmlBng > 0) {
          _initPecahanBangunanData(_currentPecahanIdx - 1, jmlBng);
          _pecahanSubStep = 2;
          _currentPecahanBangunanIdx = 1;
        } else {
          _pecahanSubStep = 3;
        }
      } else if (_pecahanSubStep == 2) {
        if (_currentPecahanBangunanIdx < jmlBng) {
          _currentPecahanBangunanIdx++;
        } else {
          _pecahanSubStep = 3;
        }
      } else if (_pecahanSubStep == 3) {
        if (_currentPecahanIdx < _jumlahPecahan) {
          _currentPecahanIdx++;
          _pecahanSubStep = 0;
          _currentPecahanBangunanIdx = 1;
        } else {
          _isPecahMode = false;
          _currentStep = 5;
        }
      }
    });
  }

  void _prevStep() {
    if (_isPecahMode) { _prevPecahanStep(); return; }

    if (_currentStep == 5) {
      if (_jenisLayanan == 'PECAH') {
        setState(() {
          _currentPecahanIdx = _jumlahPecahan;
          _pecahanSubStep = 3;
          _isPecahMode = true;
        });
      } else if (_jenisLayanan == 'HAPUS') {
        setState(() => _currentStep = 0);
      } else {
        setState(() => _currentStep = 4);
      }
    } else if (_currentStep == 4) {
      if (_jenisLayanan == 'PENGHAPUSAN' || _jenisLayanan == 'HAPUS') {
        setState(() => _currentStep = 0);
      } else if (_jenisLayanan == 'MUTASI') {
        setState(() => _currentStep = 1);
      } else {
        int jmlBangunan = int.tryParse(_jmlBangunanController.text) ?? 0;
        if (jmlBangunan > 0) {
          setState(() { _currentStep = 3; _currentBangunanIndex = jmlBangunan; });
        } else {
          setState(() => _currentStep = 2);
        }
      }
    } else if (_currentStep == 3) {
      if (_currentBangunanIndex > 1) {
        setState(() => _currentBangunanIndex--);
      } else {
        setState(() => _currentStep = 2);
      }
    } else if (_currentStep == 2) {
      if (_jenisLayanan == 'PERUBAHAN_DATA') {
        setState(() => _currentStep = 0);
      } else {
        setState(() => _currentStep = 1);
      }
    } else if (_currentStep == 1) {
      setState(() => _currentStep = 0);
    }
  }

  void _prevPecahanStep() {
    final p = _pecahanList[_currentPecahanIdx - 1];
    final jmlBng = int.tryParse(p['jumlahBangunan']?.toString() ?? '0') ?? 0;
    setState(() {
      if (_pecahanSubStep == 0 && _currentPecahanIdx == 1) {
        _isPecahMode = false;
        _currentStep = 0;
      } else if (_pecahanSubStep == 0) {
        _currentPecahanIdx--;
        _pecahanSubStep = 3;
      } else if (_pecahanSubStep == 1) {
        _pecahanSubStep = 0;
      } else if (_pecahanSubStep == 2) {
        if (_currentPecahanBangunanIdx > 1) {
          _currentPecahanBangunanIdx--;
        } else {
          _pecahanSubStep = 1;
        }
      } else if (_pecahanSubStep == 3) {
        if (jmlBng > 0) {
          _pecahanSubStep = 2;
          _currentPecahanBangunanIdx = jmlBng;
        } else {
          _pecahanSubStep = 1;
        }
      }
    });
  }

  String _getStepTitle() {
    if (_isPecahMode) {
      final subStepNames = ['Subjek Pajak', 'Objek Tanah', 'Data Bangunan', 'Lampiran'];
      final subName = subStepNames[_pecahanSubStep.clamp(0, 3)];
      if (_pecahanSubStep == 2) {
        return 'Pecahan $_currentPecahanIdx/$_jumlahPecahan: $subName ($_currentPecahanBangunanIdx)';
      }
      return 'Pecahan $_currentPecahanIdx/$_jumlahPecahan: $subName';
    }
    switch (_currentStep) {
      case 0: return 'Data Transaksi (1/6)';
      case 1: return 'Data Subjek Pajak (2/6)';
      case 2: return 'Data Objek Pajak (3/6)';
      case 3: return 'Data Bangunan ($_currentBangunanIndex dari ${_jmlBangunanController.text}) (4/6)';
      case 4: return 'Lampiran Pendukung (5/6)';
      case 5: return 'Konfirmasi Akhir (6/6)';
      default: return '';
    }
  }


  // --- Skipped Step 1 to 3 code for brevity, will paste them in next ---






  Widget _buildCurrentStepWidget() {
    // PECAH mode: show per-pecahan wizard
    if (_isPecahMode) return _buildPecahanStep();

    switch (_currentStep) {
      case 0: return _buildStep0();
      case 1: return _buildStep1();
      case 2: return _buildStep2();
      case 3: return _buildStep3Bangunan();
      case 4: return _buildStep4();
      case 5: return _buildStep5();
      default: return const SizedBox();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLastStep = _currentStep == 5;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC), // Off-White background
      appBar: AppBar(
        title: Text(_getStepTitle(), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF0F2C59),
        iconTheme: const IconThemeData(color: Colors.white),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: _isSavingDraft ? null : _saveDraft,
            icon: _isSavingDraft ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.save_outlined, size: 18, color: Colors.white),
            label: const Text('Draft', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            // Linear Progress Indicator
            LinearProgressIndicator(
              value: (_currentStep + 1) / 6,
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
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 2))],
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
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -4))],
              ),
              child: Row(
                children: [
                  if (_currentStep > 0 || _isPecahMode) ...[
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

