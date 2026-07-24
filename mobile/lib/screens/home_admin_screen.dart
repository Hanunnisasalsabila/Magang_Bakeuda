import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'tabs/admin_dashboard_tab.dart';
import 'tabs/profile_tab.dart';
import 'tabs/verifikasi_spop_tab.dart';
import 'tabs/riwayat_spop_tab.dart';
import 'akun_desa_screen.dart';
import 'daftar_objek_pajak_screen.dart';
import 'manajemen_wilayah_screen.dart';
import 'login_screen.dart';
import '../services/auth_service.dart';
import 'bantuan_admin_screen.dart';

// Palet warna resmi instansi
const Color _kNavy = Color(0xFF0C2A5B);
const Color _kGold = Color(0xFFC9A227);

class HomeAdminScreen extends StatefulWidget {
  const HomeAdminScreen({super.key});

  @override
  State<HomeAdminScreen> createState() => _HomeAdminScreenState();
}

class _HomeAdminScreenState extends State<HomeAdminScreen> {
  int _currentIndex = 0;

  String _profileName = 'Admin BKD';
  String _profileUsername = 'admin';
  String _profileRole = 'BAKEUDA';

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    final token = await const FlutterSecureStorage().read(key: 'jwt_token');

    if (token != null) {
      try {
        final parts = token.split('.');
        if (parts.length == 3) {
          final payload = json.decode(
            utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
          );
          _profileName = payload['nama_lengkap'] ?? _profileName;
          _profileUsername = payload['username'] ?? _profileUsername;
          _profileRole = payload['role'] ?? _profileRole;
        }
      } catch (_) {}
    }

    if (mounted) {
      setState(() {});
    }
  }

  List<Widget> get _pages {
    return [
      AdminDashboardTab(
        onNavigateToVerification: () => setState(() => _currentIndex = 1),
        onNavigateToHistory: () => setState(() => _currentIndex = 2),
      ),
      const VerifikasiSpopTab(),
      const RiwayatSpopTab(),
      Scaffold(
        body: ProfileTab(
          name: _profileName,
          username: _profileUsername,
          role: _profileRole,
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 70,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Image.asset(
                'assets/logo-purbalingga.png',
                height: 32,
                width: 32,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'BAKEUDA Kabupaten\nPurbalingga',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      height: 1.2,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Sistem Informasi Pajak Daerah',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.3,
                      color: _kGold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        centerTitle: false,
        elevation: 0,
        backgroundColor: _kNavy,
        foregroundColor: Colors.white,
        // Garis aksen emas di bawah AppBar sebagai penanda identitas resmi
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: Container(height: 3, color: _kGold),
        ),
        actions: const [],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Header drawer: solid navy formal, tanpa foto dekoratif dummy
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 56, 24, 24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0F2C59), Color(0xFF0A1D3D)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border(bottom: BorderSide(color: _kGold, width: 4)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Image.asset(
                      'assets/logo-purbalingga.png',
                      height: 36,
                      width: 36,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Super Admin Bakeuda',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.white,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Purbalingga',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: Colors.white70,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined, color: _kNavy),
              title: const Text('Beranda'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 0);
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.manage_accounts_outlined,
                color: _kNavy,
              ),
              title: const Text('Manajemen Pengguna'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AkunDesaScreen()),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.map_outlined, color: _kNavy),
              title: const Text('Manajemen Wilayah'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ManajemenWilayahScreen(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.fact_check_outlined, color: _kNavy),
              title: const Text('Antrean Verifikasi'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.rate_review_outlined, color: _kNavy),
              title: const Text('Pemeriksaan Berkas'),
              onTap: () {
                Navigator.pop(context);
                setState(
                  () => _currentIndex = 1,
                ); // Redirects to Antrean where they can select a file
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Silakan pilih berkas dari Antrean Verifikasi terlebih dahulu.',
                    ),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.task_alt, color: _kNavy),
              title: const Text('Riwayat Keputusan'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_outline, color: _kNavy),
              title: const Text('Profil Pengguna'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 3);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.help_outline, color: _kNavy),
              title: const Text('Bantuan'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const BantuanAdminScreen()),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.logout, color: theme.colorScheme.error),
              title: Text(
                'Logout',
                style: TextStyle(color: theme.colorScheme.error),
              ),
              onTap: () async {
                final authService = AuthService();
                await authService.logout();
                if (context.mounted) {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoginScreen(),
                    ),
                    (route) => false,
                  );
                }
              },
            ),
          ],
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        switchInCurve: Curves.easeOut,
        switchOutCurve: Curves.easeIn,
        child: _pages[_currentIndex],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddMenu(context),
        backgroundColor: _kNavy,
        foregroundColor: Colors.white,
        elevation: 4,
        shape: const CircleBorder(),
        child: const Icon(Icons.add, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: const Border(top: BorderSide(color: Color(0xFFE0DFDA))),
          boxShadow: [
            BoxShadow(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.06),
              blurRadius: 8,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: BottomAppBar(
          padding: EdgeInsets.zero,
          color: theme.colorScheme.surface,
          shape: const CircularNotchedRectangle(),
          notchMargin: 8,
          child: SizedBox(
            height: 60,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(
                  context,
                  0,
                  Icons.account_balance_outlined,
                  Icons.account_balance,
                  'Beranda',
                ),
                _buildNavItem(
                  context,
                  1,
                  Icons.fact_check_outlined,
                  Icons.fact_check,
                  'Verifikasi',
                ),
                const SizedBox(width: 48), // Space for FAB
                _buildNavItem(
                  context,
                  2,
                  Icons.task_alt,
                  Icons.task_alt,
                  'Riwayat',
                ),
                _buildNavItem(
                  context,
                  3,
                  Icons.person_outline,
                  Icons.person,
                  'Profil',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    int index,
    IconData icon,
    IconData activeIcon,
    String label,
  ) {
    final isSelected = _currentIndex == index;
    final color = isSelected
        ? _kNavy
        : Theme.of(context).colorScheme.onSurfaceVariant;

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      customBorder: const CircleBorder(),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(isSelected ? activeIcon : icon, color: color, size: 24),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  void _showAddMenu(BuildContext context) {
    showDialog(
      context: context,
      barrierColor: Colors.white.withValues(alpha: 0.9),
      builder: (BuildContext context) {
        return Material(
          type: MaterialType.transparency,
          child: Stack(
            children: [
              Positioned(
                bottom: 120,
                left: 0,
                right: 0,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildMenuButton(
                      icon: Icons.person_add_alt_1_rounded,
                      color: const Color(0xFF0C2A5B), // Navy blue
                      label: 'TAMBAH DATA\nPENGGUNA',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                const AkunDesaScreen(autoShowAddForm: true),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 40),
                    _buildMenuButton(
                      icon: Icons.map_rounded,
                      color: const Color(0xFF0C2A5B), // Navy blue
                      label: 'TAMBAH DATA\nWILAYAH',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ManajemenWilayahScreen(
                              autoShowAddForm: true,
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              Positioned(
                bottom: 40,
                left: 0,
                right: 0,
                child: Center(
                  child: InkWell(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: const BoxDecoration(
                        color: Color(0xFF8C8F99),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMenuButton({
    required IconData icon,
    required Color color,
    required String label,
    required VoidCallback onTap,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: onTap,
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            height: 1.2,
            letterSpacing: 0.5,
            color: color,
          ),
        ),
      ],
    );
  }
}
