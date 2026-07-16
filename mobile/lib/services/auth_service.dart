import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/user.dart';

class AuthService {
  final Dio _dio = Dio();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  String get _baseUrl {
    return dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:3000/api';
  }

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _dio.post(
        '$_baseUrl/auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        final token = response.data['data']['token'];
        final userData = response.data['data']['user'];
        
        await _storage.write(key: 'jwt_token', value: token);
        
        return {
          'success': true,
          'user': User.fromJson(userData),
        };
      }
      
      return {
        'success': false,
        'message': response.data['message'] ?? 'Login gagal',
      };
    } on DioException catch (e) {
      if (e.response != null && e.response?.statusCode == 401) {
        return {
          'success': false,
          'message': e.response?.data['message'] ?? 'Username atau password salah',
        };
      }
      return {
        'success': false,
        'message': 'Terjadi kesalahan koneksi atau server',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan tidak terduga',
      };
    }
  }

  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'jwt_token');
    return token != null;
  }

  Future<Map<String, dynamic>> changePassword(String oldPassword, String newPassword) async {
    try {
      final token = await _storage.read(key: 'jwt_token');
      if (token == null) {
        return {'success': false, 'message': 'Sesi telah habis. Silakan login kembali.'};
      }

      final response = await _dio.patch(
        '$_baseUrl/auth/change-password',
        data: {
          'old_password': oldPassword,
          'new_password': newPassword,
        },
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );

      if (response.statusCode == 200 && response.data['success'] == true) {
        return {
          'success': true,
          'message': response.data['message'] ?? 'Password berhasil diubah',
        };
      }

      return {
        'success': false,
        'message': response.data['message'] ?? 'Gagal mengubah password',
      };
    } on DioException catch (e) {
      if (e.response != null && e.response?.statusCode == 401) {
        return {
          'success': false,
          'message': e.response?.data['message'] ?? 'Password lama salah atau sesi habis',
        };
      }
      return {
        'success': false,
        'message': e.response?.data['message'] ?? 'Terjadi kesalahan pada server',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Terjadi kesalahan tidak terduga',
      };
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }
}
