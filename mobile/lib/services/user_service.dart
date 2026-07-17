import '../services/api_service.dart';
import 'package:dio/dio.dart';

class UserService {
  final ApiService _apiService;
  UserService(this._apiService);
  Dio get _dio => _apiService.dio;

  Future<Map<String, dynamic>> getDaftarAkun({String? search, String? role, int page = 1, int limit = 20}) async {
    final params = <String, dynamic>{'page': page, 'limit': limit};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (role != null) params['role'] = role;
    final resp = await _dio.get('/users', queryParameters: params);
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getDetailAkun(String idUser) async {
    final resp = await _dio.get('/users/$idUser');
    return resp.data['data'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createAkun(Map<String, dynamic> payload) async {
    final resp = await _dio.post('/users', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateAkun(String idUser, Map<String, dynamic> payload) async {
    final resp = await _dio.patch('/users/$idUser', data: payload);
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> resetPassword(String idUser, String passwordBaru) async {
    final resp = await _dio.post('/users/$idUser/reset-password', data: {'password_baru': passwordBaru});
    return resp.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> toggleAktif(String idUser, bool isActive) async {
    final resp = await _dio.patch('/users/$idUser', data: {'is_active': isActive});
    return resp.data as Map<String, dynamic>;
  }
}
