import 'package:flutter/material.dart';
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

  final List<Widget> _pages = [
    const DesaDashboardTab(),
    const MonitoringPajakTab(),
    const ProfileTab(
      name: 'Perangkat Desa',
      email: 'desa@purbalingga.go.id',
      role: 'Desa',
    ),
  ];


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
              leading: const Icon(Icons.description_outlined),
              title: const Text('Formulir SPOP'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SpopFormScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.domain_add_outlined),
              title: const Text('Formulir LSPOP'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const LspopFormScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.analytics_outlined),
              title: const Text('Monitoring Pajak'),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  _currentIndex = 1; // Switch to Layanan Tab
                });
              },
            ),
            ListTile(
              leading: const Icon(Icons.track_changes_outlined),
              title: const Text('Pelacakan Dokumen'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PelacakanDokumenScreen()));
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
      body: _pages[_currentIndex],
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
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: theme.colorScheme.surface,
          selectedItemColor: theme.colorScheme.primary,
          unselectedItemColor: theme.colorScheme.onSurfaceVariant,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home_filled),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.description_outlined),
              activeIcon: Icon(Icons.description),
              label: 'Layanan',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
