import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Singleton yang menyimpan dan mengelola Base URL API.
/// - Membaca dari SharedPreferences (prioritas utama).
/// - Fallback ke .env jika belum ada pengaturan kustom.
/// - Bisa diubah dari halaman login tanpa perlu build ulang APK.
class ServerConfig {
  ServerConfig._();
  static final ServerConfig instance = ServerConfig._();

  static const String _storageKey = 'custom_api_base_url';

  String? _cachedUrl;

  /// Default URL dari file .env
  String get defaultUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:3000/api';

  /// URL aktif saat ini (sudah di-cache setelah init())
  String get currentUrl => _cachedUrl ?? defaultUrl;

  /// Apakah sedang memakai URL kustom (bukan default .env)
  bool get isCustomUrl => _cachedUrl != null;

  /// Harus dipanggil sekali saat app startup (di main.dart)
  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_storageKey);
    if (saved != null && saved.isNotEmpty) {
      _cachedUrl = saved;
    }
  }

  /// Simpan URL baru dari input pengguna
  Future<void> setCustomUrl(String url) async {
    // Bersihkan trailing slash
    String cleaned = url.trim();
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, cleaned);
    _cachedUrl = cleaned;
  }

  /// Kembalikan ke URL default dari .env
  Future<void> resetToDefault() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
    _cachedUrl = null;
  }
}
