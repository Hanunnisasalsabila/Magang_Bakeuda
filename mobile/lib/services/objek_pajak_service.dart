import '../services/api_service.dart';
import 'package:dio/dio.dart';

class ObjekPajakService {
  final ApiService _apiService;
  ObjekPajakService(this._apiService);
  Dio get _dio => _apiService.dio;

  Future<Map<String, dynamic>> getDaftar({
    String? search,
    String? kodeWilayah,
    bool? statusAktif,
    int page = 1,
    int limit = 25,
  }) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (kodeWilayah != null) params['kode_wilayah'] = kodeWilayah;
    if (statusAktif != null) params['status_aktif'] = statusAktif;
    final resp = await _dio.get('/objek-pajak', queryParameters: params);
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getDetail(String nop) async {
    final resp = await _dio.get('/objek-pajak/$nop');
    return resp.data['data'] as Map<String, dynamic>;
  }
}

class WilayahService {
  final ApiService _apiService;
  WilayahService(this._apiService);
  Dio get _dio => _apiService.dio;

  Future<List<Map<String, dynamic>>> getDaftarWilayah({String? search, String? kecamatan}) async {
    final params = <String, dynamic>{};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (kecamatan != null) params['kecamatan'] = kecamatan;
    final resp = await _dio.get('/wilayah', queryParameters: params);
    final data = resp.data['data'] as List? ?? [];
    return data.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createWilayah(Map<String, dynamic> payload) async {
    final resp = await _dio.post('/wilayah', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateWilayah(String kodeWilayah, Map<String, dynamic> payload) async {
    final resp = await _dio.patch('/wilayah/$kodeWilayah', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  Future<void> deleteWilayah(String kodeWilayah) async {
    await _dio.delete('/wilayah/$kodeWilayah');
  }
}
