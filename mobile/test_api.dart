import 'dart:convert';
import 'package:http/http.dart' as http;

void main() async {
  final url = Uri.parse('http://localhost:3000/api/objek-pajak/330301000177700020');
  final res = await http.get(url);
  print(res.body);
}
