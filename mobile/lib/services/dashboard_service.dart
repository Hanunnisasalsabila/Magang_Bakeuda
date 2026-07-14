import 'package:dio/dio.dart';
import 'api_service.dart';

class DashboardService {
  final ApiService _api = ApiService();

  Future<Map<String, dynamic>?> getDashboardStats() async {
    try {
      final response = await _api.dio.get('/transaksi-spop/stats');
      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'];
      }
      return null;
    } catch (e) {
      print('Error fetching stats: $e');
      return null;
    }
  }

  Future<List<dynamic>> getRecentTransactions() async {
    try {
      final response = await _api.dio.get('/transaksi-spop');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final List data = response.data['data'];
        return data.take(5).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching transactions: $e');
      return [];
    }
  }

  Future<List<dynamic>> getActiveVerifiers() async {
    try {
      final response = await _api.dio.get('/users');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final List data = response.data['data'];
        // Filter out BAKEuda users and take 5
        return data.where((u) => u['role'] == 'BAKEUDA').take(5).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching verifiers: $e');
      return [];
    }
  }
}
