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

  // ─── Fetch Data Objek Pajak By NOP (Untuk Auto-fill) ───
  Future<Map<String, dynamic>?> getObjekPajakByNop(String nop) async {
    try {
      final resp = await _dio.get('/objek-pajak/$nop');
      if (resp.data != null && resp.data['data'] != null) {
        return resp.data['data'] as Map<String, dynamic>;
      }
    } catch (e) {
      // Return null jika tidak ditemukan atau error
    }
    return null;
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
    final draftResp = await _dio.post('/transaksi-spop', data: payload);
    final String idTransaksi = draftResp.data['data']['id_transaksi'];
    final submitResp = await _dio.post('/transaksi-spop/$idTransaksi/submit');
    return submitResp.data as Map<String, dynamic>;
  }

  // ─── Simpan sebagai draft ───
  Future<Map<String, dynamic>> saveDraft(Map<String, dynamic> payload, {String? existingId}) async {
    if (existingId != null && existingId.isNotEmpty) {
      final resp = await _dio.post('/transaksi-spop/draft/$existingId', data: payload);
      return resp.data as Map<String, dynamic>;
    } else {
      final resp = await _dio.post('/transaksi-spop', data: payload);
      return resp.data as Map<String, dynamic>;
    }
  }

  // ─── Ajukan draft ke BKD ───
  Future<Map<String, dynamic>> ajukanKeBakeuda(String idTransaksi) async {
    final resp = await _dio.patch('/transaksi-spop/$idTransaksi/ajukan');
    return resp.data as Map<String, dynamic>;
  }

  // ─── Approve (BAKEUDA) ───
  Future<Map<String, dynamic>> approveSpop(
    String idTransaksi, {
    String? kodeWilayah,
    String? kodeBlok,
    String? kodeJenisOp,
  }) async {
    final payload = <String, dynamic>{
      'status_ajuan': 'DISETUJUI',
    };
    if (kodeWilayah != null) payload['kode_wilayah'] = kodeWilayah;
    if (kodeBlok != null) payload['kode_blok'] = kodeBlok;
    if (kodeJenisOp != null) payload['kode_jenis_op'] = kodeJenisOp;
    
    final resp = await _dio.post('/transaksi-spop/$idTransaksi/approve', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  // ─── Tolak Permanen (BAKEUDA) ───
  Future<Map<String, dynamic>> tolakSpop(String idTransaksi, String catatan) async {
    final resp = await _dio.post('/transaksi-spop/$idTransaksi/tolak', data: {
      'catatan': catatan,
      'status_ajuan': 'DITOLAK',
    });
    return resp.data as Map<String, dynamic>;
  }

  // ─── Revisi (BAKEUDA) ───
  Future<Map<String, dynamic>> revisiSpop(String idTransaksi, String catatan) async {
    final resp = await _dio.post('/transaksi-spop/$idTransaksi/revisi', data: {
      'catatan': catatan,
      'status_ajuan': 'REVISI',
    });
    return resp.data as Map<String, dynamic>;
  }

  // ─── Unlock SPOP (Bakeuda) ───
  Future<Map<String, dynamic>> unlockSpop(String idTransaksi) async {
    final resp = await _dio.post('/transaksi-spop/$idTransaksi/unlock');
    return resp.data as Map<String, dynamic>;
  }

  // ─── Lock SPOP (Bakeuda) ───
  Future<Map<String, dynamic>> lockSpop(String idTransaksi) async {
    final resp = await _dio.post('/transaksi-spop/$idTransaksi/lock');
    return resp.data as Map<String, dynamic>;
  }

  // ─── Hapus Draft SPOP ───
  Future<Map<String, dynamic>> deleteTransaksi(String idTransaksi) async {
    final resp = await _dio.delete('/transaksi-spop/$idTransaksi');
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

  // ─── Monitoring objek pajak (Stats) ───
  Future<Map<String, dynamic>> getObjekPajakStats() async {
    final resp = await _dio.get('/objek-pajak/stats');
    return resp.data as Map<String, dynamic>;
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
    if (search != null && search.isNotEmpty) params['q'] = search;
    if (kodeWilayah != null) params['kode_wilayah'] = kodeWilayah;
    if (statusAjuan != null) params['status_ajuan'] = statusAjuan;
    if (statusAktif != null) params['status_aktif'] = statusAktif;
    final resp = await _dio.get('/objek-pajak', queryParameters: params);
    return resp.data as Map<String, dynamic>;
  }
}
