import 'api_service.dart';

class NotifikasiService {
  final ApiService apiService;

  NotifikasiService(this.apiService);

  Future<Map<String, dynamic>> getNotifikasi() async {
    try {
      final response = await apiService.dio.get('/notifikasi');
      return response.data;
    } catch (e) {
      throw Exception('Gagal memuat notifikasi: $e');
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await apiService.dio.patch('/notifikasi/$id/read');
    } catch (e) {
      throw Exception('Gagal menandai notifikasi dibaca: $e');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await apiService.dio.patch('/notifikasi/read-all');
    } catch (e) {
      throw Exception('Gagal menandai semua notifikasi dibaca: $e');
    }
  }
}
