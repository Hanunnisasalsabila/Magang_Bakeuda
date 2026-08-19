import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
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
  String? _statusAjuan;
  String? _catatanRevisi;

  // ── PECAH mode state ──
  bool _isPecahMode = false;
  int _currentPecahanIdx = 1;     // 1-based
  int _pecahanSubStep = 0;        // 0=Subjek, 1=Objek, 2=Bangunan, 3=Lampiran
  int _currentPecahanBangunanIdx = 1;
  int _jumlahPecahan = 2;         // minimum 2
  List<Map<String, dynamic>> _pecahanList = [];
  String _kodeBlokIndukPecah = '';
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
  final _kodeBlokController = TextEditingController();
  
  String? _kodeBlok;
  List<String> _blokOptions = [];
  bool _isFetchingBlok = false;
  double _totalLuasAsalGabung = 0.0;
  
  @override
  void initState() {
    super.initState();
    _transaksiId = widget.idTransaksi;
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
        _fetchBlokOptions(kode);
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

  Future<void> _fetchBlokOptions(String kodeWilayah) async {
    updateFormState(() {
      _isFetchingBlok = true;
      _blokOptions = [];
    });
    try {
      final res = await ApiService().dio.get('/referensi-blok?kode_wilayah=$kodeWilayah');
      if (res.data != null && res.data['data'] != null) {
        final dataBlok = res.data['data'] as List;
        updateFormState(() {
          _blokOptions = dataBlok.map((e) => e['kode_blok'].toString()).toList();
          _isFetchingBlok = false;
        });
      }
    } catch (e) {
      updateFormState(() => _isFetchingBlok = false);
    }
  }

  Future<void> _loadDraftData() async {
    setState(() => _isLoading = true);
    try {
      final d = await _spopService.getDetailTransaksi(widget.idTransaksi!);
      setState(() {
        _jenisLayanan = d['jenis_transaksi'] ?? 'BARU';
        if (_jenisLayanan == 'HAPUS') {
          _selectedKategori = 'PENGHAPUSAN';
        } else if (_jenisLayanan == 'MUTASI' || _jenisLayanan == 'PERUBAHAN_DATA') {
          _selectedKategori = 'PEMUTAKHIRAN';
        } else {
          _selectedKategori = 'BARU';
        }
        _menggunakanKuasa = d['menggunakan_kuasa'] ?? false;
        _statusAjuan = d['status_ajuan'];
        _catatanRevisi = d['catatan_bakeuda'];
        _currentStep = 1; // Skip step 0
        
        final lampObj = d['lampiran'];
        final List<Map<String, String>> tempLamp = [];
        if (lampObj != null && lampObj is Map) {
          void parseLamp(String key, String jenis) {
            final list = lampObj[key];
            if (list != null && list is List) {
              for (var url in list) {
                if (url.toString().isNotEmpty) {
                  tempLamp.add({'jenis_dokumen': jenis, 'url_file': url.toString()});
                }
              }
            }
          }
          parseLamp('url_ktp', 'KTP');
          parseLamp('url_sertifikat', 'Sertifikat Hak Milik');
          parseLamp('url_ajb', 'Akte Jual Beli');
          parseLamp('url_imb', 'Izin Mendirikan Bangunan');
          parseLamp('url_surat_kuasa', 'Surat Kuasa');
          parseLamp('url_pendukung_lokasi', 'Pendukung Lainnya');
        }
        
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
                  'statusWp': subjek['status_wp'],
                  'pekerjaan': subjek['pekerjaan'],
                  'npwp': subjek['npwp'] ?? '',
                  'noHp': subjek['no_hp'] ?? '',
                  'alamatWp': subjek['alamat_jalan'] ?? '',
                  'rt': subjek['rt'] ?? '',
                  'rw': subjek['rw'] ?? '',
                  'kelurahan': subjek['kelurahan'] ?? '',
                  'kecamatan': subjek['kecamatan'] ?? '',
                  'kabupaten': subjek['kabupaten'] ?? '',
                  'kodePos': subjek['kode_pos'] ?? '',
                  
                  'luasTanah': t['luas_tanah_baru']?.toString() ?? '',
                  'jenisTanah': t['jenis_tanah_baru'] ?? 'TANAH_BANGUNAN',
                  'jalanOp': t['jalan_op_baru'] ?? '',
                  'kodeBlok': t['kode_blok_baru'] ?? '',
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
                _kabupatenWpController.text = subjek['kabupaten'] ?? '';
                _kodePosController.text = subjek['kode_pos'] ?? '';
                
                // Set dropdown values if they are valid
                final swp = subjek['status_wp'];
                if (swp != null && _statusWpOptions.any((o) => o['value'] == swp)) _statusWp = swp;
                
                final pkj = subjek['pekerjaan'];
                if (pkj != null && _pekerjaanOptions.any((o) => o['value'] == pkj)) _pekerjaan = pkj;
             }
             _jenisTanah = tujuan['jenis_tanah_baru'] ?? 'TANAH_BANGUNAN';
             _luasTanahController.text = (tujuan['luas_tanah_baru'] ?? '').toString();
             _jalanOpController.text = tujuan['jalan_op_baru'] ?? '';
             _kodeBlok = tujuan['kode_blok_baru']?.toString();
             _kodeBlokController.text = _kodeBlok ?? '';
             _blokKavController.text = tujuan['blok_kav_no_baru'] ?? '';
             _rtOpController.text = tujuan['rt_op_baru'] ?? '';
             _rwOpController.text = tujuan['rw_op_baru'] ?? '';
             final kelOpB = tujuan['kelurahan_op_baru']?.toString();
             final kecOpB = tujuan['kecamatan_op_baru']?.toString();
             _kelurahanOpController.text = (kelOpB != null && kelOpB.isNotEmpty) ? kelOpB : (_isOpWilayahPatented ? _kelurahanOpController.text : '');
             _kecamatanOpController.text = (kecOpB != null && kecOpB.isNotEmpty) ? kecOpB : (_isOpWilayahPatented ? _kecamatanOpController.text : '');
             
             _batasUtaraController.text = tujuan['batas_utara'] ?? '';
             _batasSelatanController.text = tujuan['batas_selatan'] ?? '';
             _batasTimurController.text = tujuan['batas_timur'] ?? '';
             _batasBaratController.text = tujuan['batas_barat'] ?? '';
             _latController.text = tujuan['latitude']?.toString() ?? '-7.3934';
             _lngController.text = tujuan['longitude']?.toString() ?? '109.3663';
             
             if (tujuan['koordinat_polygon'] != null) {
                _polygonPoints.clear();
                final poly = tujuan['koordinat_polygon'];
                if (poly is List) {
                  for (var pt in poly) {
                    _polygonPoints.add(LatLng(
                      double.tryParse(pt['lat']?.toString() ?? '0') ?? 0,
                      double.tryParse(pt['lng']?.toString() ?? '0') ?? 0,
                    ));
                  }
                }
             }
             
             _jmlBangunanController.text = tujuan['jumlah_bangunan_baru']?.toString() ?? '0';
             final bngList = tujuan['data_bangunan_json'];
             if (bngList != null && bngList is List) {
                _dataBangunanList = List<Map<String, dynamic>>.from(
                    bngList.map((e) => Map<String, dynamic>.from(e as Map))
                );
             }
           }
           
           // Distribute Lampiran
           if (_jenisLayanan == 'PECAH') {
             for (var doc in tempLamp) {
               final rawUrl = doc['url_file'] as String;
               if (rawUrl.startsWith('PECAHAN_')) {
                 final parts = rawUrl.split('::');
                 if (parts.length > 1) {
                   final pNum = int.tryParse(parts[0].replaceAll('PECAHAN_', '')) ?? 1;
                   if (pNum >= 1 && pNum <= _pecahanList.length) {
                     (_pecahanList[pNum - 1]['lampiran'] as List).add({
                       'jenis_dokumen': doc['jenis_dokumen'],
                       'url_file': parts.sublist(1).join('::'),
                     });
                   }
                 }
               }
             }
           } else {
             _lampiran.addAll(tempLamp);
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
  
  String? _statusWp;
  String? _pekerjaan;
  final _alamatWpController = TextEditingController();
  final _rtController = TextEditingController();
  final _rwController = TextEditingController();
  final _kelurahanWpController = TextEditingController();
  final _kecamatanWpController = TextEditingController();
  final _kabupatenWpController = TextEditingController();
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
        'jenisPenggunaan': null,
        'luasBangunan': '',
        'jumlahLantai': '',
        'tahunDibangun': '',
        'kondisi': null,
        'konstruksi': null,
        'atap': null,
        'dinding': null,
        'lantai': null,
        'langitLangit': null,
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
        'kelurahan': '', 'kecamatan': '', 'kabupaten': '', 'kodePos': '',
        'luasTanah': '', 'jenisTanah': 'TANAH_BANGUNAN', 'jalanOp': '',
        'blokKav': '', 'rtOp': '', 'rwOp': '', 'kelurahanOp': _isOpWilayahPatented ? _kelurahanOpController.text : '',
        'kecamatanOp': _isOpWilayahPatented ? _kecamatanOpController.text : '', 'batasUtara': '', 'batasSelatan': '',
        'batasTimur': '', 'batasBarat': '', 'lat': '-7.3934', 'lng': '109.3663',
        'koordinatPolygon': <Map<String, double>>[],
        'jumlahBangunan': '0',
        'dataBangunan': <Map<String, dynamic>>[],
        'lampiran': <Map<String, dynamic>>[],
        'selectedJenisDokumen': 'KTP',
        'kodeBlokBaru': _kodeBlokIndukPecah,
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
    _kodeBlokController.dispose();
    _mapController.dispose();
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
    _totalLuasAsalGabung = 0.0;
    try {
      // Hitung total luas dari semua NOP asal yang valid
      for (var ctrl in _nopAsalControllers) {
        final nop = ctrl.text.replaceAll('.', '').trim();
        if (nop.length == 18) {
          try {
            final obj = await _spopService.getObjekPajakByNop(nop);
            if (obj != null && obj['luas_tanah'] != null) {
              _totalLuasAsalGabung += double.tryParse(obj['luas_tanah'].toString()) ?? 0.0;
            }
          } catch (e) {
            debugPrint('Failed to get luas for NOP asal $nop');
          }
        }
      }
      final obj = await _spopService.getObjekPajakByNop(firstNop);
      if (obj != null) {
        setState(() {
          _fetchedObjekPajak = obj;
          if (_totalLuasAsalGabung > 0) {
            _luasTanahController.text = _totalLuasAsalGabung.toString();
          } else if (obj['luas_tanah'] != null) {
            _luasTanahController.text = obj['luas_tanah'].toString();
          }
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
            'kabupaten': p['kabupaten'] ?? '',
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
          'kode_blok_baru': p['kodeBlokBaru'] ?? '',
          'blok_kav_no_baru': p['blokKav'] ?? '',
          'rt_op_baru': p['rtOp'] ?? '',
          'rw_op_baru': p['rwOp'] ?? '',
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
      'kabupaten': _kabupatenWpController.text,
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
      // Allow user input for luas_tanah for GABUNG
      final luasTanah = double.tryParse(_luasTanahController.text) ?? 0.0;

      detailTujuan = [{
        if (!isPerubahanData) 'nik_calon_subjek': _nikController.text,
        if (!isPerubahanData) 'calon_subjek_json': calonSubjekJson,
        if (isPerubahanData && nop.length >= 18) 'nop_generated': nop,
        'luas_tanah_baru': luasTanah,
        'luas_bangunan_baru': luasBngTotal,
        'jumlah_bangunan_baru': jmlBangunan,
        'jenis_tanah_baru': _jenisTanah == 'TANAH_DAN_BANGUNAN' ? 'TANAH_BANGUNAN' : _jenisTanah,
        'jalan_op_baru': _jalanOpController.text,
        if (_kodeBlok != null && _kodeBlok!.isNotEmpty) 'kode_blok_baru': _kodeBlok,
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
        Navigator.pop(context, true); // Kembali ke halaman sebelumnya
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
    showModalBottomSheet(
      context: context,
      builder: (BuildContext bc) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                  leading: const Icon(Icons.photo_library),
                  title: const Text('Galeri / File Document'),
                  onTap: () async {
                    Navigator.of(context).pop();
                    final result = await FilePicker.platform.pickFiles(
                      type: FileType.custom,
                      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
                      allowMultiple: false,
                    );
                    if (result != null && result.files.single.path != null) {
                      _processPickedFile(result.files.single.path!, result.files.single.name, forcedJenisDokumen);
                    }
                  }),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Kamera'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final ImagePicker picker = ImagePicker();
                  final XFile? image = await picker.pickImage(source: ImageSource.camera);
                  if (image != null) {
                    CroppedFile? croppedFile = await ImageCropper().cropImage(
                      sourcePath: image.path,
                      uiSettings: [
                        AndroidUiSettings(
                            toolbarTitle: 'Sesuaikan Foto',
                            toolbarColor: Theme.of(context).primaryColor,
                            toolbarWidgetColor: Colors.white,
                            initAspectRatio: CropAspectRatioPreset.original,
                            lockAspectRatio: false),
                        IOSUiSettings(
                          title: 'Sesuaikan Foto',
                        ),
                      ],
                    );
                    if (croppedFile != null) {
                      _processPickedFile(croppedFile.path, image.name, forcedJenisDokumen);
                    }
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _processPickedFile(String path, String name, String? forcedJenisDokumen) async {
    setState(() => _isLoading = true);
    try {
      final url = await _spopService.uploadFile(path, name);
      setState(() {
        _lampiran.add({'jenis_dokumen': forcedJenisDokumen ?? _selectedJenisDokumen, 'url_file': url});
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('Upload Berhasil', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('Dokumen ${forcedJenisDokumen ?? _selectedJenisDokumen} berhasil ditambahkan.', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            backgroundColor: Colors.green.shade700,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 3),
          ),
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
          if (obj['kode_blok'] != null) {
            _kodeBlokIndukPecah = obj['kode_blok'].toString();
          } else {
            _kodeBlokIndukPecah = '';
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
      if (_jenisLayanan == 'GABUNG') {
        double luasTujuanBaru = double.tryParse(_luasTanahController.text) ?? 0;
        double selisih = (luasTujuanBaru - _totalLuasAsalGabung).abs();
        double selisihPersen = _totalLuasAsalGabung > 0 ? (selisih / _totalLuasAsalGabung) * 100 : 0;
        
        if (selisihPersen > 2) {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text('Informasi Selisih Luas', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange)),
              content: Text(
                'Total Luas NOP Asal: ${_totalLuasAsalGabung.toStringAsFixed(0)} m²\n'
                'Luas Baru: ${luasTujuanBaru.toStringAsFixed(0)} m²\n'
                'Selisih: ${selisih.toStringAsFixed(0)} m² (${selisihPersen.toStringAsFixed(1)}%)\n\n'
                'Apakah Anda yakin ingin melanjutkan?',
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Periksa Kembali'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                  onPressed: () {
                    Navigator.pop(ctx);
                    _proceedFromStep2();
                  },
                  child: const Text('Lanjutkan'),
                ),
              ],
            ),
          );
          return;
        }
      }
      _proceedFromStep2();
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

  void _proceedFromStep2() {
    int jmlBangunan = int.tryParse(_jmlBangunanController.text) ?? 0;
    if (jmlBangunan > 0) {
      _initBangunanList(jmlBangunan);
      setState(() => _currentStep = 3);
    } else {
      setState(() => _currentStep = 4);
    }
  }

  void _nextPecahanStep() async {
    final p = _pecahanList[_currentPecahanIdx - 1];
    final jmlBng = int.tryParse(p['jumlahBangunan']?.toString() ?? '0') ?? 0;

    if (_pecahanSubStep == 3 && _currentPecahanIdx == _jumlahPecahan) {
      double totalLuas = 0;
      for (var pecahan in _pecahanList) {
        totalLuas += double.tryParse(pecahan['luasTanah']?.toString() ?? '0') ?? 0;
      }
      double luasInduk = double.tryParse(_luasTanahController.text) ?? 0;
      
      if (luasInduk > 0 && totalLuas != luasInduk) {
        final selisih = (totalLuas - luasInduk).abs();
        final selisihPersen = (selisih / luasInduk * 100).toStringAsFixed(1);
        final isExceed = totalLuas > luasInduk;

        final shouldContinue = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            title: Row(
              children: [
                Icon(
                  isExceed ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
                  color: isExceed ? Colors.red.shade700 : Colors.amber.shade700,
                ),
                const SizedBox(width: 8),
                const Expanded(child: Text('Informasi Selisih Luas', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSelisihRow('Luas Induk', '${luasInduk.toStringAsFixed(0)} m²'),
                const SizedBox(height: 6),
                _buildSelisihRow('Total Pecahan', '${totalLuas.toStringAsFixed(0)} m²'),
                const Divider(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isExceed ? Colors.red.shade50 : Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: isExceed ? Colors.red.shade200 : Colors.amber.shade200),
                  ),
                  child: Text(
                    isExceed
                        ? 'Luas pecahan MELEBIHI induk sebesar ${selisih.toStringAsFixed(0)} m² ($selisihPersen%).\nMohon diperiksa kembali.'
                        : 'Luas pecahan KURANG dari induk sebesar ${selisih.toStringAsFixed(0)} m² ($selisihPersen%).\nPastikan sisa lahan sudah diperhitungkan.',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isExceed ? Colors.red.shade800 : Colors.amber.shade800,
                    ),
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('Periksa Kembali'),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(ctx, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue.shade700,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Lanjutkan'),
              ),
            ],
          ),
        );

        if (shouldContinue != true) return;
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

  Widget _buildSelisihRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: Colors.black87)),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
      ],
    );
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
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(2.0),
          child: Container(
            color: const Color(0xFFD4AF37), // Garis emas (Gold border)
            height: 2.0,
          ),
        ),
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
            if ((_statusAjuan == 'REVISI' || _statusAjuan == 'PERLU_PERBAIKAN') && _currentStep < 5)
              Container(
                margin: const EdgeInsets.only(left: 16, right: 16, top: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange.shade300),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.warning_amber_rounded, color: Colors.orange.shade800, size: 20),
                        const SizedBox(width: 8),
                        Text('Catatan Revisi dari Bakeuda', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange.shade800)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(_catatanRevisi ?? 'Tidak ada catatan.', style: TextStyle(color: Colors.orange.shade900, fontSize: 13)),
                  ],
                ),
              ),
            // Linear Progress Indicator
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: (_currentStep + 1) / 6,
                  backgroundColor: Colors.grey.shade300,
                  color: const Color(0xFF0F2C59),
                  minHeight: 8,
                ),
              ),
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
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
              child: SafeArea(
                top: false,
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
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.arrow_back_ios, size: 14),
                            SizedBox(width: 4),
                            Text('Kembali', style: TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
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
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  isLastStep ? 'Ajukan Data' : (_selectedKategori == 'PENGHAPUSAN' && _currentStep == 0 ? 'Lanjut Hapus' : 'Lanjut'),
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                if (!isLastStep) ...[
                                  const SizedBox(width: 4),
                                  const Icon(Icons.arrow_forward_ios, size: 14),
                                ],
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
            ),
          ],
        ),
      ),
    );
  }
}

