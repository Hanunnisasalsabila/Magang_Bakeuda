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
import 'draft_spop_screen.dart';
import 'data_objek_pajak_screen.dart';
import '../services/auth_service.dart';

const Color _kNavy = Color(0xFF0F2C59);
const Color _kGold = Color(0xFFE8B831);

class HomeDesaScreen extends StatefulWidget {
  const HomeDesaScreen({super.key});

  @override
  State<HomeDesaScreen> createState() => _HomeDesaScreenState();
}

class _HomeDesaScreenState extends State<HomeDesaScreen> {
  int _currentIndex = 0;

  List<Widget> _pages = [];

  String get _currentTabTitle {
    switch (_currentIndex) {
      case 0:
        return 'Sistem Informasi Pajak Daerah';
      case 1:
        return 'Pemantauan Objek Pajak';
      case 2:
        return 'Pengelolaan Draf SPOP';
      default:
        return '';
    }
  }
  String _profileName = 'Perangkat Desa';
  String _profileEmail = 'desa@purbalingga.go.id';
  String _profileRole = 'DESA';

  @override
  void initState() {
    super.initState();
    _pages = [
      DesaDashboardTab(
        onLihatSemua: () {
          setState(() => _currentIndex = 1);
        },
        onLihatDraf: () {
          setState(() => _currentIndex = 2);
        },
      ),
      const MonitoringPajakTab(),
      const DraftSpopScreen(),
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
            utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
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
                const Text(
                  'Pilih Jenis Formulir',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: const Icon(Icons.description, color: Colors.blue),
                  title: const Text('Formulir SPOP (Bumi & Bangunan)'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SpopFormScreen()),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.domain, color: Colors.green),
                  title: const Text('Formulir LSPOP (Bangunan Khusus)'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const LspopFormScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDrawerSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
      child: Text(
        title,
        style: TextStyle(
          color: Colors.grey.shade500,
          fontWeight: FontWeight.bold,
          fontSize: 11,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isSelected = false,
    bool isDestructive = false,
  }) {
    final color = isDestructive
        ? Colors.red.shade600
        : (isSelected ? _kNavy : Colors.grey.shade700);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        leading: Icon(icon, color: color, size: 22),
        title: Text(
          title,
          style: TextStyle(
            color: color,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
            fontSize: 13,
          ),
        ),
        tileColor: isSelected
            ? _kNavy.withValues(alpha: 0.05)
            : Colors.transparent,
        onTap: onTap,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        toolbarHeight: 76,
        titleSpacing: 0,
        elevation: 0,
        backgroundColor: _kNavy,
        foregroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Image.asset('assets/logo-purbalingga.png'),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _profileName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      _profileEmail,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w400,
                        color: Colors.white70,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 1),
                    Text(
                      _currentTabTitle,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: _kGold,
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
      ),
      drawer: Drawer(
        backgroundColor: Colors.white,
        child: Column(
          children: [
            InkWell(
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => Scaffold(
                      appBar: AppBar(title: const Text('Profil Pengguna')),
                      body: ProfileTab(
                        name: _profileName,
                        username: _profileEmail,
                        role: _profileRole,
                      ),
                    ),
                  ),
                );
              },
              child: Container(
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
                            _profileName,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _profileEmail,
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 12,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 8),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 8, bottom: 20),
                children: [
                  _buildDrawerSectionTitle('MENU UTAMA'),
                  _buildDrawerItem(
                    icon: Icons.dashboard_rounded,
                    title: 'Beranda',
                    isSelected: _currentIndex == 0,
                    onTap: () {
                      Navigator.pop(context);
                      setState(() => _currentIndex = 0);
                    },
                  ),
                  _buildDrawerItem(
                    icon: Icons.analytics_rounded,
                    title: 'Status Pengajuan PBB-P2',
                    isSelected: _currentIndex == 1,
                    onTap: () {
                      Navigator.pop(context);
                      setState(() => _currentIndex = 1);
                    },
                  ),

                  _buildDrawerSectionTitle('LAYANAN PAJAK DAERAH'),
                  ExpansionTile(
                    leading: const Icon(
                      Icons.description_rounded,
                      color: Colors.grey,
                      size: 22,
                    ),
                    title: const Text(
                      'Pendaftaran SPOP Baru',
                      style: TextStyle(
                        color: Colors.grey,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    childrenPadding: const EdgeInsets.only(left: 16),
                    shape: const Border(),
                    children: [
                      _buildDrawerItem(
                        icon: Icons.feed_rounded,
                        title: 'SPOP Standar (Bumi & Bangunan)',
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const SpopFormScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDrawerItem(
                        icon: Icons.domain_rounded,
                        title: 'LSPOP (Bangunan Khusus)',
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const LspopFormScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                  _buildDrawerItem(
                    icon: Icons.folder_special_rounded,
                    title: 'Draf Dokumen Tersimpan',
                    isSelected: _currentIndex == 2,
                    onTap: () {
                      Navigator.pop(context);
                      setState(() => _currentIndex = 2);
                    },
                  ),
                  _buildDrawerItem(
                    icon: Icons.storage_rounded,
                    title: 'Arsip Data Objek Pajak',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => DataObjekPajakScreen(
                            profileName: _profileName,
                            profileEmail: _profileEmail,
                          ),
                        ),
                      );
                    },
                  ),

                  _buildDrawerSectionTitle('PENGATURAN & BANTUAN'),
                  _buildDrawerItem(
                    icon: Icons.account_circle_rounded,
                    title: 'Profil Pengguna',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => Scaffold(
                            appBar: AppBar(
                              title: const Text('Profil Pengguna'),
                            ),
                            body: ProfileTab(
                              name: _profileName,
                              username: _profileEmail,
                              role: _profileRole,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  _buildDrawerItem(
                    icon: Icons.help_rounded,
                    title: 'Pusat Bantuan',
                    onTap: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Pusat Bantuan belum tersedia.'),
                        ),
                      );
                    },
                  ),

                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                    child: Divider(color: Color(0xFFEEEEEE)),
                  ),

                  _buildDrawerItem(
                    icon: Icons.logout_rounded,
                    title: 'Logout',
                    isDestructive: true,
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
          ],
        ),
      ),
      body: _pages[_currentIndex]
          .animate(key: ValueKey(_currentIndex))
          .fadeIn(duration: 300.ms)
          .slideY(begin: 0.05, end: 0, duration: 300.ms, curve: Curves.easeOut),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showFormulirOptions(context),
        backgroundColor: _kNavy,
        elevation: 4,
        shape: const CircleBorder(),
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        color: Colors.white,
        elevation: 10,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                icon: Icons.dashboard_outlined,
                activeIcon: Icons.dashboard,
                label: 'Beranda',
                index: 0,
              ),
              _buildNavItem(
                icon: Icons.analytics_outlined,
                activeIcon: Icons.analytics,
                label: 'Pantau',
                index: 1,
              ),
              const SizedBox(width: 48), // Space for FAB
              _buildNavItem(
                icon: Icons.folder_open,
                activeIcon: Icons.folder,
                label: 'Draf',
                index: 2,
              ),
              _buildNavItem(
                icon: Icons.account_circle_outlined,
                activeIcon: Icons.account_circle,
                label: 'Profil',
                index: 3,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required int index,
  }) {
    final isSelected = _currentIndex == index;
    return InkWell(
      onTap: () {
        if (index == 3) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => Scaffold(
                appBar: AppBar(title: const Text('Profil Pengguna')),
                body: ProfileTab(
                  name: _profileName,
                  username: _profileEmail,
                  role: _profileRole,
                ),
              ),
            ),
          );
        } else {
          setState(() => _currentIndex = index);
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            isSelected ? activeIcon : icon,
            color: isSelected ? _kNavy : Colors.grey.shade600,
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? _kNavy : Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }
}
