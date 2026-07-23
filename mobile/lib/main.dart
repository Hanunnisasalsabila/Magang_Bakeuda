import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'screens/login_screen.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  // Pastikan binding terinisialisasi sebelum menjalankan kode async di main
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load file .env untuk mengambil API_BASE_URL
  await dotenv.load(fileName: ".env");
  
  // Inisialisasi format tanggal bahasa Indonesia
  await initializeDateFormatting('id', null);
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Manajemen PBB',
      theme: AppTheme.lightTheme,
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
