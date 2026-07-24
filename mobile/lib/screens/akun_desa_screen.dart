import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/user_service.dart';
import '../services/export_service.dart';

// Palet warna resmi instansi
const Color _kNavy = Color(0xFF0C2A5B);
const Color _kGold = Color(0xFFC9A227);

class AkunDesaScreen extends StatefulWidget {
  final bool autoShowAddForm;
  const AkunDesaScreen({super.key, this.autoShowAddForm = false});

  @override
  State<AkunDesaScreen> createState() => _AkunDesaScreenState();
}

class _AkunDesaScreenState extends State<AkunDesaScreen> {
  final _userService = UserService(ApiService());
  final _searchController = TextEditingController();
  Timer? _debounce;

  List<Map<String, dynamic>> _daftarAkun = [];
  bool _isLoading = true;
  String? _errorMsg;
  int _currentPage = 1;
  final int _itemsPerPage = 10;

  List<Map<String, dynamic>> _wilayahList = [];
  List<String> _kecamatanList = [];
  String? _selectedWilayahFilter;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    _searchController.addListener(_onSearchChanged);
    await _fetchWilayah();
    _loadData();
    if (widget.autoShowAddForm && mounted) {
      _showFormDialog();
    }
  }

  void _onSearchChanged() {
    setState(() {}); // refresh tombol clear (X)
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _loadData();
    });
  }

  Future<void> _fetchWilayah() async {
    try {
      final list = await _userService.getWilayah();
      setState(() {
        _wilayahList = list;
        _kecamatanList =
            list
                .map((w) => w['kecamatan']?.toString() ?? '')
                .where((s) => s.isNotEmpty)
                .toSet()
                .toList()
              ..sort();
      });
    } catch (e) {
      // Ignored
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    // Removed infinite scrolling
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      final result = await _userService.getDaftarAkun(
        search: _searchController.text.isNotEmpty
            ? _searchController.text
            : null,
        role: 'DESA',
        page: 1,
        limit: 5000,
      );

      var newItems = (result['data'] as List? ?? [])
          .cast<Map<String, dynamic>>();

      // Client-side filter for wilayah since backend might not support it
      if (_selectedWilayahFilter != null &&
          _selectedWilayahFilter != 'Semua Kecamatan') {
        newItems = newItems.where((item) {
          final kode = item['kode_wilayah'];
          final found = _wilayahList.firstWhere(
            (w) => w['kode_wilayah'] == kode,
            orElse: () => {},
          );
          return found['kecamatan'] == _selectedWilayahFilter;
        }).toList();
      }

      // Client-side filter untuk pencarian juga — jaga-jaga kalau parameter
      // `search` di backend tidak benar-benar memfilter hasilnya.
      final searchQuery = _searchController.text.trim().toLowerCase();
      if (searchQuery.isNotEmpty) {
        newItems = newItems.where((item) {
          final nama = (item['nama_lengkap'] ?? '').toString().toLowerCase();
          final username = (item['username'] ?? '').toString().toLowerCase();
          return nama.contains(searchQuery) || username.contains(searchQuery);
        }).toList();
      }

      final total = result['total'] as int? ?? 0;

      setState(() {
        _daftarAkun = newItems;
        _currentPage = 1;
      });
    } on DioException catch (e) {
      setState(() {
        _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data';
      });
    } catch (e) {
      setState(() {
        _errorMsg = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Helper: cari nama kecamatan dari kode_wilayah sebuah akun
  String _kecamatanDariAkun(Map<String, dynamic> akun) {
    final kode = akun['kode_wilayah'];
    if (kode == null || _wilayahList.isEmpty) return '-';
    final found = _wilayahList.where((w) => w['kode_wilayah'] == kode).toList();
    return found.isNotEmpty ? (found[0]['kecamatan']?.toString() ?? '-') : '-';
  }

  String _namaDesaDariAkun(Map<String, dynamic> akun) {
    final kode = akun['kode_wilayah'];
    if (kode == null || _wilayahList.isEmpty)
      return akun['nama_lengkap'] ?? '-';
    final found = _wilayahList.where((w) => w['kode_wilayah'] == kode).toList();
    return found.isNotEmpty
        ? (found[0]['nama_desa']?.toString() ?? akun['nama_lengkap'] ?? '-')
        : (akun['nama_lengkap'] ?? '-');
  }

  InputDecoration _formalInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.black38, fontSize: 14),
      isDense: true,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(6),
        borderSide: const BorderSide(color: _kNavy, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    );
  }

  Future<void> _showFormDialog() async {
    final usernameCtrl = TextEditingController();
    final namaCtrl = TextEditingController();
    final nipCtrl = TextEditingController();
    String? selectedWilayahKode;
    final passwordCtrl = TextEditingController();
    final formKey = GlobalKey<FormState>();
    final dialogWidth = _dialogWidth(context);

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        titlePadding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
        contentPadding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
        actionsPadding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    'Tambah Akun Baru',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.black54),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Lengkapi data untuk membuat akses login.',
              style: TextStyle(
                fontSize: 14,
                color: Colors.black54,
                fontWeight: FontWeight.normal,
              ),
            ),
            const SizedBox(height: 16),
            const Divider(height: 1),
          ],
        ),
        content: SizedBox(
          width: dialogWidth,
          child: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  const Text(
                    'Nama Lengkap',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: namaCtrl,
                    decoration: _formalInputDecoration('Contoh: Budi Santoso'),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      if (v.length < 2) return 'Minimal 2 karakter';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Username',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: usernameCtrl,
                    decoration: _formalInputDecoration('Contoh: budi.santoso'),
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      if (v.length < 3) return 'Minimal 3 karakter';
                      if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(v))
                        return 'Hanya huruf, angka, dan underscore';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'NIP (Opsional)',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: nipCtrl,
                    decoration: _formalInputDecoration(
                      'Contoh: 19850101 201001 1 001',
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Kata Sandi (Password)',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: passwordCtrl,
                    decoration: _formalInputDecoration('Masukkan password...'),
                    obscureText: true,
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Wajib diisi';
                      if (v.length < 8) return 'Minimal 8 karakter';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Area / Wilayah Tugas',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  DropdownMenu<String>(
                    width: dialogWidth,
                    menuHeight: 250,
                    initialSelection: selectedWilayahKode,
                    enableFilter: true,
                    enableSearch: false,
                    hintText: 'Pilih / Cari Kode Wilayah',
                    inputDecorationTheme: InputDecorationTheme(
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: const BorderSide(color: _kNavy, width: 1.5),
                      ),
                    ),
                    dropdownMenuEntries: _wilayahList.map((w) {
                      final text = '${w['kode_wilayah']} - ${w['nama_desa']} (${w['kecamatan']})';
                      return DropdownMenuEntry<String>(
                        value: w['kode_wilayah']?.toString() ?? '',
                        label: text,
                      );
                    }).toList(),
                    onSelected: (v) {
                      selectedWilayahKode = v;
                    },
                  ),
                  if (selectedWilayahKode == null)
                    const Padding(
                      padding: EdgeInsets.only(top: 6, left: 14),
                      child: Text('Harus pilih wilayah', style: TextStyle(color: Colors.red, fontSize: 12)),
                    ),
                ],
              ),
            ),
          ),
        ),
        actions: [
          const Divider(height: 1),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              OutlinedButton(
                onPressed: () => Navigator.pop(ctx),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.grey.shade300),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  foregroundColor: Colors.black87,
                ),
                child: const Text('Batal'),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: () async {
                  if (formKey.currentState!.validate() && selectedWilayahKode != null) {
                    Navigator.pop(ctx);
                    setState(() => _isLoading = true);
                    try {
                      await _userService.createAkun({
                        'username': usernameCtrl.text,
                        'nama_lengkap': namaCtrl.text,
                        'nip': nipCtrl.text.isNotEmpty ? nipCtrl.text : null,
                        'kode_wilayah': selectedWilayahKode,
                        'password': passwordCtrl.text,
                        'role': 'DESA',
                      });
                      if (mounted)
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Akun berhasil ditambahkan'),
                          ),
                        );
                      _loadData();
                    } catch (e) {
                      if (mounted)
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Gagal menambahkan: $e')),
                        );
                      setState(() => _isLoading = false);
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _kNavy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                child: const Text('Simpan Pengguna'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ============================================================
  // EDIT AKUN PENGGUNA — setara dengan form di versi website:
  // Nama Lengkap, Username, NIP, Password (opsional), Area/Wilayah.
  // ============================================================
  Future<void> _showEditAkunDialog(Map<String, dynamic> akun) async {
    final namaCtrl = TextEditingController(text: akun['nama_lengkap'] ?? '');
    final usernameCtrl = TextEditingController(text: akun['username'] ?? '');
    final nipCtrl = TextEditingController(text: akun['nip'] ?? '');
    final passwordCtrl = TextEditingController();
    String? selectedWilayahKode = akun['kode_wilayah']?.toString();
    final formKey = GlobalKey<FormState>();
    final dialogWidth = _dialogWidth(context);

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(builder: (ctx, setDialogState) {
        return AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        titlePadding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
        contentPadding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
        actionsPadding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Edit Akun Pengguna',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.black54),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Ubah informasi atau reset password pengguna.',
              style: TextStyle(fontSize: 14, color: Colors.black54),
            ),
            const SizedBox(height: 16),
            const Divider(height: 1),
          ],
        ),
        content: SizedBox(
          width: dialogWidth,
          child: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  const Text(
                    'Nama Lengkap',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: namaCtrl,
                    decoration: _formalInputDecoration('Nama Lengkap'),
                    validator: (v) =>
                        (v == null || v.isEmpty) ? 'Wajib diisi' : null,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Username',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: usernameCtrl,
                    decoration: _formalInputDecoration('Username'),
                    validator: (v) =>
                        (v == null || v.isEmpty) ? 'Wajib diisi' : null,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'NIP (Opsional)',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: nipCtrl,
                    decoration: _formalInputDecoration(
                      'Contoh: 19850101 201001 1 001',
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Kata Sandi (Password)',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: passwordCtrl,
                    decoration: _formalInputDecoration('Masukkan password...'),
                    obscureText: true,
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Kosongkan jika tidak ingin mengubah password',
                    style: TextStyle(fontSize: 11, color: Colors.black45),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Area / Wilayah Tugas',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  DropdownMenu<String>(
                    width: _dialogWidth(context),
                    menuHeight: 250,
                    initialSelection: selectedWilayahKode,
                    enableFilter: true,
                    enableSearch: false,
                    hintText: 'Pilih / Cari Kode Wilayah',
                    inputDecorationTheme: InputDecorationTheme(
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6),
                        borderSide: const BorderSide(color: _kNavy, width: 1.5),
                      ),
                    ),
                    dropdownMenuEntries: _wilayahList.map((w) {
                      final text = '${w['kode_wilayah']} - ${w['nama_desa']} (${w['kecamatan']})';
                      return DropdownMenuEntry<String>(
                        value: w['kode_wilayah']?.toString() ?? '',
                        label: text,
                      );
                    }).toList(),
                    onSelected: (v) {
                      setDialogState(() {
                        selectedWilayahKode = v;
                      });
                    },
                  ),
                  if (selectedWilayahKode == null)
                    const Padding(
                      padding: EdgeInsets.only(top: 6, left: 14),
                      child: Text('Harus pilih wilayah', style: TextStyle(color: Colors.red, fontSize: 12)),
                    ),
                ],
              ),
            ),
          ),
        ),
        actions: [
          const Divider(height: 1),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              OutlinedButton(
                onPressed: () => Navigator.pop(ctx),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.grey.shade300),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  foregroundColor: Colors.black87,
                ),
                child: const Text('Batal'),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: () async {
                  if (!formKey.currentState!.validate()) return;
                  Navigator.pop(ctx);
                  setState(() => _isLoading = true);
                  try {
                    // NOTE: mengasumsikan UserService punya method updateAkun().
                    // Kalau nama method di user_service.dart Anda beda,
                    // sesuaikan baris pemanggilan di bawah ini.
                    await _userService
                        .updateAkun(akun['id_user']?.toString() ?? '', {
                          'nama_lengkap': namaCtrl.text,
                          'username': usernameCtrl.text,
                          'nip': nipCtrl.text.isNotEmpty ? nipCtrl.text : null,
                          'kode_wilayah': selectedWilayahKode,
                          if (passwordCtrl.text.isNotEmpty)
                            'password': passwordCtrl.text,
                        });
                    if (mounted)
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Perubahan berhasil disimpan'),
                        ),
                      );
                    _loadData();
                  } catch (e) {
                    if (mounted)
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Gagal menyimpan: $e')),
                      );
                    setState(() => _isLoading = false);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _kNavy,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
                child: const Text('Simpan Perubahan'),
              ),
            ],
          ),
        ],
      );
    }));
  }

  Future<void> _hapusAkun(Map<String, dynamic> akun) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Hapus Akun'),
        content: Text(
          'Anda yakin ingin menghapus akun ${akun['nama_lengkap']}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFB3261E),
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );

    if (ok == true && mounted) {
      setState(() => _isLoading = true);
      try {
        await _userService.deleteAkun(akun['id_user']?.toString() ?? '');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Akun berhasil dihapus')),
          );
        }
        _loadData();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Gagal menghapus: $e')));
        }
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _toggleAktif(Map<String, dynamic> akun) async {
    final isAktif = akun['is_active'] == true;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        title: Text(isAktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'),
        content: SizedBox(
          width: _dialogWidth(context),
          child: Text(
            isAktif
                ? 'Akun "${akun['nama_lengkap']}" akan dinonaktifkan. Pengguna tidak bisa login.'
                : 'Akun "${akun['nama_lengkap']}" akan diaktifkan kembali.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: _kNavy,
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(isAktif ? 'Nonaktifkan' : 'Aktifkan'),
          ),
        ],
      ),
    );
    if (ok == true && mounted) {
      try {
        await _userService.toggleAktif(
          akun['id_user']?.toString() ?? '',
          !isAktif,
        );
        _loadData();
      } catch (e) {
        if (mounted)
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Gagal: $e')));
      }
    }
  }

  /// Lebar dialog yang aman untuk layar sempit maupun lebar,
  /// supaya tidak lagi ada RenderFlex overflow di HP kecil.
  double _dialogWidth(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final maxAvailable = screenWidth - 48; // margin kiri+kanan dialog
    return maxAvailable < 480 ? maxAvailable : 480;
  }

  // ============================================================
  // CETAK KREDENSIAL PER KECAMATAN (rekap semua desa sekaligus)
  // ============================================================
  Future<void> _showCetakKredensialDialog() async {
    final namaKepalaBkdCtrl = TextEditingController(
      text: 'Drs. SISWANTO, S.Pd., M.Si.',
    );
    final nipKepalaBkdCtrl = TextEditingController(
      text: '19700101 199003 1 001',
    );
    final namaCamatCtrl = TextEditingController();
    final nipCamatCtrl = TextEditingController();
    String? selectedKecamatan;

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          final akunKecamatan = selectedKecamatan == null
              ? <Map<String, dynamic>>[]
              : _daftarAkun
                    .where((a) => _kecamatanDariAkun(a) == selectedKecamatan)
                    .toList();
          final daftarDesa = _daftarAkun
              .where((a) => _kecamatanDariAkun(a) == selectedKecamatan)
              .map(
                (a) => {
                  'nama_desa': _namaDesaDariAkun(a),
                  'username': a['username'],
                },
              )
              .toList();
          final dialogWidth = _dialogWidth(context);

          return Dialog(
            insetPadding: const EdgeInsets.symmetric(
              horizontal: 20,
              vertical: 24,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                maxWidth: dialogWidth,
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Cetak Kredensial',
                            style: TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.bold,
                              color: _kNavy,
                            ),
                          ),
                        ),
                        IconButton(
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          icon: const Icon(Icons.close, color: Colors.black54),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Lengkapi data penanda tangan dan pilih kecamatan untuk mencetak rekap.',
                      style: TextStyle(fontSize: 13, color: Colors.black54),
                    ),
                    const SizedBox(height: 12),
                    const Divider(height: 1),
                    const SizedBox(height: 16),
                    Flexible(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Penanda Tangan BKD',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: _kNavy,
                              ),
                            ),
                            const SizedBox(height: 10),
                            _labeledField('Nama Kepala BKD', namaKepalaBkdCtrl),
                            const SizedBox(height: 12),
                            _labeledField('NIP Kepala BKD', nipKepalaBkdCtrl),
                            const SizedBox(height: 18),
                            const Text(
                              'Penanda Tangan Kecamatan',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: _kNavy,
                              ),
                            ),
                            const SizedBox(height: 10),
                            _labeledField(
                              'Nama Camat',
                              namaCamatCtrl,
                              hint: 'Nama Camat...',
                            ),
                            const SizedBox(height: 12),
                            _labeledField(
                              'NIP Camat',
                              nipCamatCtrl,
                              hint: 'Format: 18 digit angka',
                            ),
                            const SizedBox(height: 18),
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey.shade300),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: DropdownButtonFormField<String>(
                                isExpanded: true, // cegah overflow
                                value: selectedKecamatan,
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 12,
                                  ),
                                ),
                                hint: const Text(
                                  'Pilih Kecamatan untuk Pratinjau',
                                  overflow: TextOverflow.ellipsis,
                                ),
                                items: _kecamatanList
                                    .map(
                                      (k) => DropdownMenuItem(
                                        value: k,
                                        child: Text(
                                          k,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    )
                                    .toList(),
                                onChanged: (v) {
                                  setDialogState(() => selectedKecamatan = v);
                                },
                              ),
                            ),
                            const SizedBox(height: 16),
                            if (selectedKecamatan != null) ...[
                              Text(
                                'Jumlah Desa/Kelurahan: ${akunKecamatan.length}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Container(
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: Colors.grey.shade300,
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  child: ConstrainedBox(
                                    constraints: BoxConstraints(
                                      minWidth: dialogWidth - 42,
                                    ),
                                    child: Table(
                                      border: TableBorder(
                                        horizontalInside: BorderSide(
                                          color: Colors.grey.shade300,
                                        ),
                                      ),
                                      columnWidths: const {
                                        0: FixedColumnWidth(36),
                                        1: FlexColumnWidth(1.6),
                                        2: FlexColumnWidth(1.6),
                                      },
                                      children: [
                                        TableRow(
                                          decoration: const BoxDecoration(
                                            color: Color(0xFFF1F0EC),
                                          ),
                                          children: [
                                            _tableHeaderCell('No'),
                                            _tableHeaderCell('Desa/Kelurahan'),
                                            _tableHeaderCell('Username'),
                                          ],
                                        ),
                                        for (
                                          var i = 0;
                                          i < akunKecamatan.length;
                                          i++
                                        )
                                          TableRow(
                                            children: [
                                              _tableCell('${i + 1}'),
                                              _tableCell(
                                                _namaDesaDariAkun(
                                                  akunKecamatan[i],
                                                ).toUpperCase(),
                                              ),
                                              _tableCell(
                                                akunKecamatan[i]['username'] ??
                                                    '-',
                                              ),
                                            ],
                                          ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: selectedKecamatan == null
                            ? null
                            : () async {
                                Navigator.pop(ctx);
                                await _cetakKredensialKecamatan(
                                  kecamatan: selectedKecamatan!,
                                  daftarAkun: akunKecamatan,
                                  namaKepalaBkd: namaKepalaBkdCtrl.text,
                                  nipKepalaBkd: nipKepalaBkdCtrl.text,
                                  namaCamat: namaCamatCtrl.text,
                                  nipCamat: nipCamatCtrl.text,
                                  aksi: 'open',
                                );
                              },
                        icon: const Icon(Icons.print_outlined, size: 18),
                        label: const Text('Cetak & Unduh PDF'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kNavy,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _labeledField(
    String label,
    TextEditingController ctrl, {
    String? hint,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: ctrl,
          decoration: _formalInputDecoration(hint ?? ''),
        ),
      ],
    );
  }

  Widget _tableHeaderCell(String text) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    child: Text(
      text,
      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
    ),
  );

  Widget _tableCell(String text) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    child: Text(text, style: const TextStyle(fontSize: 12)),
  );

  /// NOTE: `ExportService.cetakKredensialKecamatanPdf` belum ada di
  /// export_service.dart — tambahkan method dengan signature berikut
  /// (lihat pesan saya di bawah untuk contoh kop surat resminya):
  ///
  /// static Future<File> cetakKredensialKecamatanPdf({
  ///   required String kecamatan,
  ///   required String namaKepalaBkd,
  ///   required String nipKepalaBkd,
  ///   required String namaCamat,
  ///   required String nipCamat,
  ///   required List<Map<String, dynamic>> daftarDesa, // {nama_desa, username}
  ///   required String passwordAwal,
  /// })
  Future<void> _cetakKredensialKecamatan({
    required String kecamatan,
    required List<Map<String, dynamic>> daftarAkun,
    required String namaKepalaBkd,
    required String nipKepalaBkd,
    required String namaCamat,
    required String nipCamat,
    required String aksi,
  }) async {
    try {
      final daftarDesa = daftarAkun
          .map(
            (a) => {
              'nama_desa': _namaDesaDariAkun(a),
              'username': a['username']?.toString() ?? '-',
            },
          )
          .toList();

      final file = await ExportService.cetakKredensialKecamatanPdf(
        kecamatan: kecamatan,
        namaKepalaBkd: namaKepalaBkd,
        nipKepalaBkd: nipKepalaBkd,
        namaCamat: namaCamat,
        nipCamat: nipCamat,
        daftarDesa: daftarDesa,
        passwordAwal: 'BakeudaDesa2026!',
      );

      if (!mounted) return;
      await ExportService.openFile(file);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Gagal cetak: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Ensure _kecamatanList is populated even on hot reload if _wilayahList is ready
    if (_wilayahList.isNotEmpty && _kecamatanList.isEmpty) {
      _kecamatanList =
          _wilayahList
              .map((w) => w['kecamatan']?.toString() ?? '')
              .where((s) => s.isNotEmpty)
              .toSet()
              .toList()
            ..sort();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      appBar: AppBar(
        backgroundColor: _kNavy,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
        titleSpacing: 0,
        title: Row(
          children: [
            Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              padding: const EdgeInsets.all(2),
              child: Image.asset('assets/logo-purbalingga.png', height: 32),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'BAKEUDA Kabupaten\nPurbalingga',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.1,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    'Manajemen Akun Desa',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: _kGold,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Cetak Kredensial per Kecamatan',
            icon: const Icon(Icons.print_outlined),
            onPressed: _showCetakKredensialDialog,
          ),
          const SizedBox(width: 4),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(130),
          child: Container(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(bottom: BorderSide(color: _kGold, width: 3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      flex: 3,
                      child: TextField(
                        controller: _searchController,
                        textInputAction: TextInputAction.search,
                        decoration: InputDecoration(
                          hintText: 'Cari nama desa atau username...',
                          hintStyle: const TextStyle(
                            fontSize: 13,
                            color: Colors.black45,
                          ),
                          prefixIcon: const Icon(Icons.search, size: 20),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, size: 20),
                                  onPressed: () {
                                    _searchController.clear();
                                    _loadData();
                                  },
                                )
                              : null,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.grey.shade300),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: _kNavy,
                              width: 1.5,
                            ),
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(
                            vertical: 10,
                            horizontal: 16,
                          ),
                        ),
                        onSubmitted: (v) => _loadData(),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: Container(
                        height: 44, // Match search field height approximately
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          value: _selectedWilayahFilter,
                          icon: const Icon(
                            Icons.keyboard_arrow_down,
                            color: Colors.black54,
                          ),
                          decoration: const InputDecoration(
                            prefixIcon: Icon(
                              Icons.location_on_outlined,
                              color: Colors.black54,
                            ),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 12,
                            ),
                            border: InputBorder.none,
                          ),
                          style: const TextStyle(
                            fontSize: 13,
                            color: Colors.black87,
                          ),
                          items: [
                            const DropdownMenuItem(
                              value: null,
                              child: Text('Semua'),
                            ),
                            ..._kecamatanList.map((kec) {
                              return DropdownMenuItem(
                                value: kec,
                                child: Text(
                                  kec,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              );
                            }),
                          ],
                          onChanged: (v) {
                            setState(() {
                              _selectedWilayahFilter = v;
                            });
                            _loadData();
                          },
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Menampilkan ${_daftarAkun.length} data akun desa',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showFormDialog,
        backgroundColor: _kNavy,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Tambah Akun',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: _kNavy))
                : _errorMsg != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 48,
                          color: theme.colorScheme.error,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _errorMsg!,
                          style: TextStyle(color: theme.colorScheme.error),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () => _loadData(),
                          icon: const Icon(Icons.refresh),
                          label: const Text('Coba Lagi'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _kNavy,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  )
                : _daftarAkun.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.search_off,
                            size: 44,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 10),
                          Text(
                            _searchController.text.isNotEmpty
                                ? 'Tidak ada hasil untuk "${_searchController.text}"'
                                : 'Belum ada data akun desa',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    ),
                  )
                : _buildPaginatedList(theme),
          ),
        ],
      ),
    );
  }

  Widget _buildPaginatedList(ThemeData theme) {
    final totalPages = (_daftarAkun.length / _itemsPerPage).ceil();
    final startIndex = (_currentPage - 1) * _itemsPerPage;
    final endIndex = (startIndex + _itemsPerPage < _daftarAkun.length)
        ? startIndex + _itemsPerPage
        : _daftarAkun.length;
    final paginatedData = _daftarAkun.sublist(startIndex, endIndex);

    return Column(
      children: [
        Expanded(
          child: RefreshIndicator(
            color: _kNavy,
            onRefresh: () => _loadData(),
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
              itemCount: paginatedData.length,
              itemBuilder: (context, index) {
                final akun = paginatedData[index];
                final kode = akun['kode_wilayah'];
                String wilayahText = '-';
                if (kode != null && _wilayahList.isNotEmpty) {
                  final found = _wilayahList
                      .where((w) => w['kode_wilayah'] == kode)
                      .toList();
                  if (found.isNotEmpty) {
                    wilayahText =
                        '${found[0]['nama_desa']}, ${found[0]['kecamatan']}';
                  }
                }

                return Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 46,
                                  height: 46,
                                  decoration: BoxDecoration(
                                    color: theme.colorScheme.primaryContainer
                                        .withValues(alpha: 0.5),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  alignment: Alignment.center,
                                  child: Icon(
                                    Icons.person,
                                    color: theme.colorScheme.primary,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        akun['nama_lengkap'] ?? '-',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 15,
                                          color: Colors.black87,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        wilayahText,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.black54,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                                PopupMenuButton<String>(
                                  icon: const Icon(
                                    Icons.more_vert,
                                    color: Colors.black45,
                                  ),
                                  onSelected: (v) {
                                    if (v == 'edit')
                                      _showEditAkunDialog(akun);
                                    else if (v == 'hapus')
                                      _hapusAkun(akun);
                                  },
                                  itemBuilder: (_) => [
                                    const PopupMenuItem(
                                      value: 'edit',
                                      child: ListTile(
                                        leading: Icon(
                                          Icons.edit_outlined,
                                          color: _kNavy,
                                        ),
                                        title: Text('Edit Akun'),
                                        contentPadding: EdgeInsets.zero,
                                      ),
                                    ),
                                    PopupMenuItem(
                                      value: 'hapus',
                                      child: ListTile(
                                        leading: const Icon(
                                          Icons.delete_outline,
                                          color: Color(0xFFB3261E),
                                        ),
                                        title: const Text('Hapus Akun'),
                                        contentPadding: EdgeInsets.zero,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            const Divider(height: 1),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: _infoChip(
                                    icon: Icons.badge_outlined,
                                    label:
                                        (akun['nip'] != null &&
                                            akun['nip'].toString().isNotEmpty)
                                        ? 'NIP ${akun['nip']}'
                                        : 'NIP belum diatur',
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: _infoChip(
                                    icon: Icons.assignment_ind_outlined,
                                    label: akun['username'] ?? '-',
                                  ),
                                ),
                                const SizedBox(width: 8),
                                if (kode != null)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEAF3DE),
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(
                                        color: const Color(0xFFBBD79A),
                                      ),
                                    ),
                                    child: Text(
                                      kode.toString(),
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF3D6A16),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    )
                    .animate()
                    .fade(duration: 300.ms, delay: ((index % 10) * 40).ms)
                    .slideY(
                      begin: 0.05,
                      duration: 300.ms,
                      curve: Curves.easeOutQuad,
                    );
              },
            ),
          ),
        ),
        _buildPaginationControls(totalPages),
        const SizedBox(height: 80), // Padding for FAB
      ],
    );
  }

  Widget _buildPaginationControls(int totalPages) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          TextButton.icon(
            onPressed: _currentPage > 1
                ? () => setState(() => _currentPage--)
                : null,
            icon: const Icon(Icons.chevron_left),
            label: const Text('Sebelumnya'),
          ),
          Expanded(
            child: Text(
              'Halaman $_currentPage dari $totalPages',
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          TextButton.icon(
            onPressed: _currentPage < totalPages
                ? () => setState(() => _currentPage++)
                : null,
            icon: const Icon(Icons.chevron_right),
            label: const Text('Selanjutnya'),
            iconAlignment: IconAlignment.end,
          ),
        ],
      ),
    );
  }

  Widget _infoChip({required IconData icon, required String label}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F6F2),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 15, color: Colors.black54),
          const SizedBox(width: 6),
          Flexible(
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
