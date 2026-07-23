import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'tabs/desa_dashboard_tab.dart';
import 'tabs/profile_tab.dart';
import 'tabs/monitoring_pajak_tab.dart';
import 'spop_form_screen.dart';
import 'lspop_form_screen.dart';
import 'pelacakan_dokumen_screen.dart';
import 'login_screen.dart';
import '../services/auth_service.dart';

class HomeDesaScreen extends StatefulWidget {
  const HomeDesaScreen({super.key});

  @override
  State<HomeDesaScreen> createState() => _HomeDesaScreenState();
}

class _HomeDesaScreenState extends State<HomeDesaScreen> {
  int _currentIndex = 0;

  List<Widget> _pages = [];
  String _profileName = 'Perangkat Desa';
  String _profileEmail = 'desa@purbalingga.go.id';
  String _profileRole = 'DESA';

  @override
  void initState() {
    super.initState();
    _pages = [
      const DesaDashboardTab(),
      const MonitoringPajakTab(),
    ];
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    final token = await const FlutterSecureStorage().read(key: 'jwt_token');
    
    if (token != null) {
      try {
        final parts = token.split('.');
        if (parts.length == 3) {
          final payload = json.decode(
            utf8.decode(base64Url.decode(base64Url.normalize(parts[1])))
          );
          if (mounted) {
            setState(() {
              _profileName = payload['nama_lengkap'] ?? _profileName;
              _profileEmail = payload['username'] ?? _profileEmail;
              _profileRole = payload['role'] ?? _profileRole;
            });
          }
        }
      } catch (_) {}
    }
  }

  void _showFormulirOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Pilih Jenis Formulir', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                ListTile(
                  leading: const Icon(Icons.description, color: Colors.blue),
                  title: const Text('Formulir SPOP (Bumi & Bangunan)'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const SpopFormScreen()));
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.domain, color: Colors.green),
                  title: const Text('Formulir LSPOP (Bangunan Khusus)'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const LspopFormScreen()));
                  },
                ),
              ],
            ),
          ),
        );
      }
    );
  }


  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset('assets/logo-purbalingga.png', height: 28),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'BAKEUDA',
                  style: TextStyle(
                    fontWeight: FontWeight.w900, 
                    fontSize: 16,
                    letterSpacing: 1.2,
                    color: theme.colorScheme.primary,
                  ),
                ),
                Text(
                  'SPOP Digital',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ],
        ),
        centerTitle: false,
        elevation: 0,
        backgroundColor: theme.colorScheme.surface,
        foregroundColor: theme.colorScheme.onSurface,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications_none_rounded, color: theme.colorScheme.primary),
            onPressed: () {
              
            },
          )
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              padding: EdgeInsets.zero,
              margin: EdgeInsets.zero,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                image: const DecorationImage(
                  image: NetworkImage('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop'),
                  fit: BoxFit.cover,
                  opacity: 0.2,
                ),
              ),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      theme.colorScheme.primary.withValues(alpha: 0.9),
                      theme.colorScheme.primary.withValues(alpha: 0.4),
                    ],
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Image.asset('assets/logo-purbalingga.png', height: 32, width: 32),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Perangkat Desa',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                'desa@purbalingga.go.id',
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: Colors.white.withValues(alpha: 0.8),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profil Pengguna'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => Scaffold(
                  body: ProfileTab(
                    name: _profileName,
                    username: _profileEmail, // This variable holds the username now
                    role: _profileRole,
                  ),
                )));
              },
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.logout, color: theme.colorScheme.error),
              title: Text('Logout', style: TextStyle(color: theme.colorScheme.error)),
              onTap: () async {
                final authService = AuthService();
                await authService.logout();
                if (context.mounted) {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                    (route) => false,
                  );
                }
              },
            ),
          ],
        ),
      ),
      body: PageView.builder(
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _pages.length,
        itemBuilder: (context, index) {
          if (index != _currentIndex) return const SizedBox.shrink();
          return _pages[index].animate().fadeIn(duration: 300.ms).slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut);
        },
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex == 2 ? 1 : _currentIndex, // Safe fallback
          onTap: (index) {
            if (index == 1) {
              _showFormulirOptions(context);
            } else if (index == 2) {
              setState(() => _currentIndex = 1); // Monitoring is index 1 in _pages
            } else {
              setState(() => _currentIndex = 0);
            }
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: theme.colorScheme.surface,
          selectedItemColor: theme.colorScheme.primary,
          unselectedItemColor: theme.colorScheme.onSurfaceVariant,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.add_card, color: Colors.white, size: 24),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.05, 1.05), duration: 1.seconds),
              label: 'Formulir',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.analytics_outlined),
              activeIcon: Icon(Icons.analytics),
              label: 'Monitoring',
            ),
          ],
        ),
      ),
    );
  }
}
