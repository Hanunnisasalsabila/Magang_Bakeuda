import 'package:flutter/services.dart';

class NopInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    // Hanya ambil digit
    var text = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');
    
    // Maksimal 18 digit
    if (text.length > 18) {
      text = text.substring(0, 18);
    }
    
    var buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      // Tambahkan titik sesuai format: 33.03.010.001.001.0001.0
      if ((i == 1 || i == 3 || i == 6 || i == 9 || i == 12 || i == 16) && i != text.length - 1) {
        buffer.write('.');
      }
    }
    
    return TextEditingValue(
      text: buffer.toString(),
      selection: TextSelection.collapsed(offset: buffer.length),
    );
  }
}

/// Formatter untuk Luas Tanah / Bangunan:
/// - Tidak boleh diawali angka 0, koma, atau titik (angka pertama wajib 1-9)
/// - Boleh menggunakan koma (,) atau titik (.) untuk desimal (maksimal 2 digit di belakang koma)
class LuasInputFormatter extends TextInputFormatter {
  static final RegExp _pattern = RegExp(r'^[1-9]\d*([.,]\d{0,2})?$');

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    if (newValue.text.isEmpty) return newValue;
    if (_pattern.hasMatch(newValue.text)) {
      return newValue;
    }
    return oldValue;
  }

  static double parse(String? text) {
    if (text == null || text.trim().isEmpty) return 0.0;
    return double.tryParse(text.trim().replaceAll(',', '.')) ?? 0.0;
  }

  static String? validate(String? v, {String emptyMsg = 'Wajib diisi'}) {
    if (v == null || v.trim().isEmpty) return emptyMsg;
    final normalized = v.trim().replaceAll(',', '.');
    if (normalized.endsWith('.')) return 'Angka di belakang koma wajib diisi';
    final parts = normalized.split('.');
    if (parts.length == 2 && (int.tryParse(parts[1]) ?? 0) == 0) {
      return 'Angka di belakang koma tidak boleh 0';
    }
    final val = double.tryParse(normalized) ?? 0;
    if (val < 1) return 'Minimal 1 m² (tidak boleh 0)';
    return null;
  }
}
