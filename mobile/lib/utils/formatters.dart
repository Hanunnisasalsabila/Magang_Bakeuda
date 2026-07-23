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
