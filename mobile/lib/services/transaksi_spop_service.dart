import 'package:dio/dio.dart';
import '../services/api_service.dart';

class TransaksiSpopService {
  final ApiService _apiService;

  TransaksiSpopService(this._apiService);

  Dio get _dio => _apiService.dio;

  // ─── Daftar antrean (semua transaksi, difilter oleh server berdasarkan role) ───
  Future<List<Map<String, dynamic>>> getAntreanVerifikasi({String? status}) async {
    final params = <String, dynamic>{};
    if (status != null) params['status_ajuan'] = status;
    final resp = await _dio.get('/transaksi-spop', queryParameters: params);
    final data = resp.data['data'] as List? ?? [];
    return data.cast<Map<String, dynamic>>();
  }

  // ─── Daftar transaksi milik desa yang login (alias getAntrean tanpa filter) ───
  Future<List<Map<String, dynamic>>> getTransaksiSaya({int page = 1, int limit = 20}) async {
    final resp = await _dio.get('/transaksi-spop');
    final data = resp.data['data'] as List? ?? [];
    return data.cast<Map<String, dynamic>>();
  }

  // ─── Detail satu transaksi ───
  Future<Map<String, dynamic>> getDetailTransaksi(String idTransaksi) async {
    final resp = await _dio.get('/transaksi-spop/$idTransaksi');
    // Backend returns { success, data }
    if (resp.data is Map && resp.data['data'] != null) {
      return resp.data['data'] as Map<String, dynamic>;
    }
    return resp.data as Map<String, dynamic>;
  }

  // ─── Submit SPOP baru (langsung ajukan, bukan draft) ───
  Future<Map<String, dynamic>> submitSpop(Map<String, dynamic> payload) async {
    // is_draft = false agar langsung masuk antrean
    payload['is_draft'] = false;
    final resp = await _dio.post('/transaksi-spop', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  // ─── Simpan sebagai draft ───
  Future<Map<String, dynamic>> saveDraft(Map<String, dynamic> payload) async {
    final resp = await _dio.post('/transaksi-spop/draft', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  // ─── Ajukan draft ke BKD ───
  Future<Map<String, dynamic>> ajukanKeBakeuda(String idTransaksi) async {
    final resp = await _dio.patch('/transaksi-spop/$idTransaksi/ajukan');
    return resp.data as Map<String, dynamic>;
  }

  // ─── Approve / tolak oleh verifikator (BAKEUDA) ───
  Future<Map<String, dynamic>> verifikasiSpop(String idTransaksi, {
    required bool disetujui,
    String? catatan,
  }) async {
    final resp = await _dio.patch('/transaksi-spop/$idTransaksi/verifikasi-bakeuda', data: {
      'disetujui': disetujui,
      if (catatan != null && catatan.isNotEmpty) 'catatan': catatan,
    });
    return resp.data as Map<String, dynamic>;
  }

  // ─── Upload lampiran/dokumen ───
  Future<String> uploadFile(String filePath, String fileName) async {
    final formData = FormData.fromMap({
      'file': await MultipartFile.fromFile(filePath, filename: fileName),
    });
    final resp = await _dio.post('/transaksi-spop/upload', data: formData);
    return (resp.data['url_file'] ?? '') as String;
  }

  // ─── Monitoring objek pajak (untuk tab monitoring) ───
  Future<Map<String, dynamic>> getMonitoringObjekPajak({
    String? search,
    String? kodeWilayah,
    String? statusAjuan,
    bool? statusAktif,
    int page = 1,
    int limit = 20,
  }) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (kodeWilayah != null) params['kode_wilayah'] = kodeWilayah;
    if (statusAjuan != null) params['status_ajuan'] = statusAjuan;
    if (statusAktif != null) params['status_aktif'] = statusAktif;
    final resp = await _dio.get('/objek-pajak', queryParameters: params);
    return resp.data as Map<String, dynamic>;
  }
}
