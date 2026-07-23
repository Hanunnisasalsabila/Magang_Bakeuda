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
  String _profileName = 'Perangkat Desa';
  String _profileEmail = 'desa@purbalingga.go.id';
  String _profileRole = 'DESA';

  @override
  void initState() {
    super.initState();
    _pages = [const DesaDashboardTab(), const MonitoringPajakTab()];
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
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
                width: 42,
                height: 42,
                padding: const EdgeInsets.all(4),
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
                  children: [
                    Text(
                      _profileName,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 16,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _profileEmail,
                      style: const TextStyle(
                        fontSize: 13,
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
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Header drawer: solid navy formal
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
              decoration: const BoxDecoration(
                color: _kNavy,
                border: Border(bottom: BorderSide(color: _kGold, width: 3)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
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
                      children: [
                        Text(
                          'Perangkat Desa',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          _profileEmail,
                          style: theme.textTheme.bodySmall?.copyWith(
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
              leading: const Icon(Icons.analytics_outlined, color: _kNavy),
              title: const Text('Pemantauan PBB-P2'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 1);
              },
            ),
            ExpansionTile(
              leading: const Icon(Icons.description_outlined, color: _kNavy),
              title: const Text('Pengajuan SPOP'),
              childrenPadding: const EdgeInsets.only(left: 16),
              children: [
                ListTile(
                  leading: const Icon(
                    Icons.feed_outlined,
                    size: 20,
                    color: _kNavy,
                  ),
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
                  leading: const Icon(Icons.domain, size: 20, color: _kNavy),
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
            ListTile(
              leading: const Icon(Icons.edit_document, color: _kNavy),
              title: const Text('Draft SPOP'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Draft SPOP belum tersedia.')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.storage_outlined, color: _kNavy),
              title: const Text('Data Objek Pajak'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const PelacakanDokumenScreen(),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_outline, color: _kNavy),
              title: const Text('Profil Pengguna'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => Scaffold(
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
            const Divider(),
            ListTile(
              leading: const Icon(Icons.help_outline, color: _kNavy),
              title: const Text('Bantuan'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Pusat Bantuan belum tersedia.'),
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.logout, color: theme.colorScheme.error),
              title: Text(
                'Keluar',
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
      body: PageView.builder(
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _pages.length,
        itemBuilder: (context, index) {
          if (index != _currentIndex) return const SizedBox.shrink();
          return _pages[index]
              .animate()
              .fadeIn(duration: 300.ms)
              .slideY(
                begin: 0.05,
                end: 0,
                duration: 300.ms,
                curve: Curves.easeOut,
              );
        },
      ),
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
                icon: Icons.home_outlined,
                activeIcon: Icons.home,
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
                icon: Icons.description_outlined,
                activeIcon: Icons.description,
                label: 'Draft',
                index: 2,
              ),
              _buildNavItem(
                icon: Icons.person_outline,
                activeIcon: Icons.person,
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
        if (index == 2) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Draft SPOP belum tersedia.')),
          );
        } else if (index == 3) {
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
