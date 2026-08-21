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

  /// Mengubah path relatif file (misal: /uploads/foto.jpg) menjadi URL absolut
  /// yang sesuai dengan Base URL saat ini.
  /// 
  /// Jika [rawUrl] sudah berupa URL absolut (data lama dari database),
  /// maka akan diganti domain/IP-nya agar sesuai dengan koneksi saat ini.
  /// 
  /// Contoh:
  /// - Input:  `/uploads/foto123.jpg`
  ///   Output: `http://192.168.1.15:3000/uploads/foto123.jpg`
  /// 
  /// - Input:  `http://192.168.1.OLD:3000/uploads/foto123.jpg` (data lama)
  ///   Output: `http://192.168.1.15:3000/uploads/foto123.jpg` (IP baru)
  String resolveFileUrl(String rawUrl) {
    if (rawUrl.isEmpty) return rawUrl;

    // Ambil Base URL tanpa suffix "/api" 
    // (misal: currentUrl = "http://192.168.1.15:3000/api" → baseHost = "http://192.168.1.15:3000")
    String baseHost = currentUrl;
    if (baseHost.endsWith('/api')) {
      baseHost = baseHost.substring(0, baseHost.length - 4);
    }

    // Kasus 1: Path relatif (data baru dari backend yang sudah diperbaiki)
    // Contoh: "/uploads/foto123.jpg"
    if (rawUrl.startsWith('/')) {
      return '$baseHost$rawUrl';
    }

    // Kasus 2: URL absolut (data lama yang sudah terlanjur masuk database)
    // Contoh: "http://192.168.1.OLD:3000/uploads/foto123.jpg"
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      try {
        final uri = Uri.parse(rawUrl);
        // Ambil path-nya saja (misal: /uploads/foto123.jpg)
        final relativePath = uri.path;
        return '$baseHost$relativePath';
      } catch (_) {
        return rawUrl; // Jika gagal parse, kembalikan apa adanya
      }
    }

    // Kasus 3: Hanya nama file saja (fallback)
    // Contoh: "foto123.jpg"
    return '$baseHost/uploads/$rawUrl';
  }
}
