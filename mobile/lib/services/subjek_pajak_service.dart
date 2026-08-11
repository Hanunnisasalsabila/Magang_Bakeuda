import '../services/api_service.dart';
import 'package:dio/dio.dart';

class SubjekPajakService {
  final ApiService _apiService;
  SubjekPajakService(this._apiService);
  Dio get _dio => _apiService.dio;

  /// GET /subjek-pajak?q=...&page=...&limit=...
  Future<Map<String, dynamic>> getDaftar({
    String? search,
    int page = 1,
    int limit = 25,
  }) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (search != null && search.isNotEmpty) params['q'] = search;
    final resp = await _dio.get('/subjek-pajak', queryParameters: params);
    return resp.data as Map<String, dynamic>;
  }

  /// GET /subjek-pajak/find/detail?nik=...
  Future<Map<String, dynamic>> getDetail(String nik) async {
    final resp = await _dio.get('/subjek-pajak/find/detail', queryParameters: {'nik': nik});
    final body = resp.data as Map<String, dynamic>;
    return body['data'] as Map<String, dynamic>;
  }
}
