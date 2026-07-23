import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/user_service.dart';
import '../services/export_service.dart';

class AkunDesaScreen extends StatefulWidget {
  const AkunDesaScreen({super.key});

  @override
  State<AkunDesaScreen> createState() => _AkunDesaScreenState();
}

class _AkunDesaScreenState extends State<AkunDesaScreen> {
  final _userService = UserService(ApiService());
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _daftarAkun = [];
  bool _isLoading = true;
  String? _errorMsg;
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadData(reset: true);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoadingMore && _hasMore) _loadData(reset: false);
    }
  }

  Future<void> _loadData({bool reset = true}) async {
    if (reset) {
      setState(() { _isLoading = true; _errorMsg = null; _page = 1; _hasMore = true; });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      final result = await _userService.getDaftarAkun(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
        role: 'DESA',
        page: _page,
        limit: 20,
      );
      final newItems = (result['data'] as List? ?? []).cast<Map<String, dynamic>>();
      final total = result['total'] as int? ?? 0;

      setState(() {
        if (reset) _daftarAkun = newItems; else _daftarAkun.addAll(newItems);
        _page++;
        _hasMore = _daftarAkun.length < total;
      });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; });
    } catch (e) {
      setState(() { _errorMsg = 'Error: $e'; });
    } finally {
      setState(() { _isLoading = false; _isLoadingMore = false; });
    }
  }

  Future<void> _cetakKredensial(Map<String, dynamic> akun) async {
    try {
      final namaLengkap = akun['nama_lengkap']?.toString() ?? '-';
      final username = akun['username']?.toString() ?? '-';
      final kodeWilayah = akun['kode_wilayah']?.toString() ?? '-';

      final file = await ExportService.cetakKredensialPdf(
        namaDesa: namaLengkap,
        kecamatan: kodeWilayah,
        username: username,
        passwordAwal: 'BakeudaDesa2026!',
      );

      if (mounted) {
        final choice = await showModalBottomSheet<String>(
          context: context,
          builder: (ctx) => SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(leading: const Icon(Icons.open_in_new), title: const Text('Buka PDF'), onTap: () => Navigator.pop(ctx, 'open')),
                ListTile(leading: const Icon(Icons.share), title: const Text('Bagikan (WhatsApp, dll)'), onTap: () => Navigator.pop(ctx, 'share')),
              ],
            ),
          ),
        );
        if (choice == 'open') { await ExportService.openFile(file); }
        if (choice == 'share') { await ExportService.shareFile(file, subject: 'Kredensial Akun – $namaLengkap'); }
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal cetak: $e')));
    }
  }

  Future<void> _resetPassword(Map<String, dynamic> akun) async {
    final pwController = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Atur password baru untuk:\n${akun['nama_lengkap']}'),
            const SizedBox(height: 12),
            TextField(
              controller: pwController,
              decoration: InputDecoration(
                labelText: 'Password Baru',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Reset')),
        ],
      ),
    );

    if (ok == true && pwController.text.isNotEmpty && mounted) {
      try {
        await _userService.resetPassword(akun['id_user']?.toString() ?? '', pwController.text);
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('✅ Password berhasil direset!')));
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal reset: $e')));
      }
    }
  }

  Future<void> _toggleAktif(Map<String, dynamic> akun) async {
    final isAktif = akun['is_active'] == true;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isAktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'),
        content: Text(isAktif
            ? 'Akun "${akun['nama_lengkap']}" akan dinonaktifkan. Pengguna tidak bisa login.'
            : 'Akun "${akun['nama_lengkap']}" akan diaktifkan kembali.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: Text(isAktif ? 'Nonaktifkan' : 'Aktifkan')),
        ],
      ),
    );
    if (ok == true && mounted) {
      try {
        await _userService.toggleAktif(akun['id_user']?.toString() ?? '', !isAktif);
        _loadData(reset: true);
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manajemen Akun Desa'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(72),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari nama desa atau username...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchController.clear(); _loadData(reset: true); })
                    : null,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onSubmitted: (_) => _loadData(reset: true),
            ),
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMsg != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
                      const SizedBox(height: 8),
                      Text(_errorMsg!, style: TextStyle(color: theme.colorScheme.error)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(onPressed: () => _loadData(reset: true), icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => _loadData(reset: true),
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _daftarAkun.length + (_hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index >= _daftarAkun.length) {
                        return const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()));
                      }

                      final akun = _daftarAkun[index];
                      final bool isAktif = akun['is_active'] == true;

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: theme.colorScheme.outline.withValues(alpha: 0.2)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          child: Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: isAktif ? theme.colorScheme.primaryContainer : theme.colorScheme.surfaceContainerHighest,
                                child: Icon(Icons.holiday_village_outlined, color: isAktif ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(akun['nama_lengkap'] ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 2),
                                    Text('@${akun['username'] ?? '-'}', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                                    const SizedBox(height: 4),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: isAktif ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        isAktif ? 'Aktif' : 'Tidak Aktif',
                                        style: TextStyle(color: isAktif ? Colors.green : Colors.red, fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Action menu
                              PopupMenuButton<String>(
                                icon: const Icon(Icons.more_vert),
                                onSelected: (v) {
                                  if (v == 'cetak') _cetakKredensial(akun);
                                  if (v == 'reset') _resetPassword(akun);
                                  if (v == 'toggle') _toggleAktif(akun);
                                },
                                itemBuilder: (_) => [
                                  const PopupMenuItem(value: 'cetak', child: ListTile(leading: Icon(Icons.print_outlined), title: Text('Cetak Kredensial'))),
                                  const PopupMenuItem(value: 'reset', child: ListTile(leading: Icon(Icons.lock_reset), title: Text('Reset Password'))),
                                  PopupMenuItem(
                                    value: 'toggle',
                                    child: ListTile(
                                      leading: Icon(isAktif ? Icons.block : Icons.check_circle_outline),
                                      title: Text(isAktif ? 'Nonaktifkan' : 'Aktifkan'),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ).animate().fade(duration: 400.ms, delay: ((index % 10) * 50).ms).slideY(begin: 0.1, duration: 400.ms, curve: Curves.easeOutQuad);
                    },
                  ),
                ),
    );
  }
}
