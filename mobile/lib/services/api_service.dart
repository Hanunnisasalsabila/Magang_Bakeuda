import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'server_config.dart';

class ApiService {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ServerConfig.instance.currentUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'jwt_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio;

  /// Memperbarui baseUrl secara live (setelah user mengubah pengaturan server)
  void refreshBaseUrl() {
    _dio.options.baseUrl = ServerConfig.instance.currentUrl;
  }
}
