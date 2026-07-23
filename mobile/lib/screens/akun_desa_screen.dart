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
  int _page = 1;
  bool _hasMore = true;
  bool _isLoadingMore = false;
  List<Map<String, dynamic>> _wilayahList = [];
  List<String> _kecamatanList = [];
  String? _selectedWilayahFilter;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _fetchWilayah();
    _loadData(reset: true);
    _scrollController.addListener(_onScroll);
    // Pencarian langsung berjalan saat mengetik (debounce 400ms),
    // dan tombol clear muncul/hilang otomatis.
    _searchController.addListener(_onSearchChanged);
    if (widget.autoShowAddForm) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showFormDialog();
      });
    }
  }

  void _onSearchChanged() {
    setState(() {}); // refresh tombol clear (X)
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      _loadData(reset: true);
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
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoadingMore && _hasMore) _loadData(reset: false);
    }
  }

  Future<void> _loadData({bool reset = true}) async {
    if (reset) {
      setState(() {
        _isLoading = true;
        _errorMsg = null;
        _page = 1;
        _hasMore = true;
      });
    } else {
      setState(() => _isLoadingMore = true);
    }

    try {
      final result = await _userService.getDaftarAkun(
        search: _searchController.text.isNotEmpty
            ? _searchController.text
            : null,
        role: 'DESA',
        page: _page,
        limit: 500,
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

      final total = result['total'] as int? ?? 0;

      setState(() {
        if (reset)
          _daftarAkun = newItems;
        else
          _daftarAkun.addAll(newItems);
        _page++;
        _hasMore = _daftarAkun.length < total;
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
        _isLoadingMore = false;
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
                  DropdownButtonFormField<String>(
                    isExpanded:
                        true, // wajib: cegah overflow saat teks item panjang
                    value: selectedWilayahKode,
                    decoration: _formalInputDecoration('Pilih Kode Wilayah'),
                    items: _wilayahList.map((w) {
                      return DropdownMenuItem<String>(
                        value: w['kode_wilayah']?.toString() ?? '',
                        child: Text(
                          '${w['kode_wilayah']} - ${w['nama_desa']} (${w['kecamatan']})',
                          overflow: TextOverflow.ellipsis,
                        ),
                      );
                    }).toList(),
                    onChanged: (v) {
                      selectedWilayahKode = v;
                    },
                    validator: (v) => v == null ? 'Harus pilih wilayah' : null,
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
                  if (formKey.currentState!.validate()) {
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
                      _loadData(reset: true);
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

  Future<void> _resetPassword(Map<String, dynamic> akun) async {
    final pwController = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        title: const Text('Reset Password'),
        content: SizedBox(
          width: _dialogWidth(context),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Atur password baru untuk:\n${akun['nama_lengkap']}'),
              const SizedBox(height: 12),
              TextField(
                controller: pwController,
                decoration: _formalInputDecoration('Password baru'),
              ),
            ],
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
            child: const Text('Reset'),
          ),
        ],
      ),
    );

    if (ok == true && pwController.text.isNotEmpty && mounted) {
      try {
        await _userService.resetPassword(
          akun['id_user']?.toString() ?? '',
          pwController.text,
        );
        if (mounted)
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Password berhasil direset')),
          );
      } catch (e) {
        if (mounted)
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Gagal reset: $e')));
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
        _loadData(reset: true);
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
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
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
                            label: const Text('Cetak PDF'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: _kNavy,
                              side: const BorderSide(color: _kNavy),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
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
                                      aksi: 'share',
                                    );
                                  },
                            icon: const Icon(Icons.send_outlined, size: 18),
                            label: const Text('Share WA'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _kNavy,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                        ),
                      ],
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
      if (aksi == 'open') {
        await ExportService.openFile(file);
      } else {
        await ExportService.shareFile(
          file,
          subject: 'Kredensial Akun Desa – Kecamatan $kecamatan',
        );
      }
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
          preferredSize: const Size.fromHeight(83),
          child: Container(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(bottom: BorderSide(color: _kGold, width: 3)),
            ),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  textInputAction: TextInputAction.search,
                  decoration: InputDecoration(
                    hintText: 'Cari nama desa atau username...',
                    hintStyle: const TextStyle(
                      fontSize: 14,
                      color: Colors.black45,
                    ),
                    prefixIcon: const Icon(Icons.search, size: 20),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 20),
                            onPressed: () {
                              _searchController.clear();
                              _loadData(reset: true);
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
                      borderSide: const BorderSide(color: _kNavy, width: 1.5),
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: 12,
                      horizontal: 16,
                    ),
                  ),
                  // Pencarian sudah otomatis berjalan (debounce) lewat listener,
                  // ini untuk trigger instan kalau user menekan Enter/Search.
                  onSubmitted: (v) => _loadData(reset: true),
                ),
                const SizedBox(height: 14),
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
          Container(
            color: const Color(0xFFF7F6F2),
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: DropdownButtonFormField<String>(
                      isExpanded: true, // cegah overflow nama kecamatan panjang
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
                          horizontal: 16,
                          vertical: 4,
                        ),
                        border: InputBorder.none,
                      ),
                      items: [
                        const DropdownMenuItem(
                          value: null,
                          child: Text('Semua Kecamatan'),
                        ),
                        ..._kecamatanList.map((kec) {
                          return DropdownMenuItem(
                            value: kec,
                            child: Text(kec, overflow: TextOverflow.ellipsis),
                          );
                        }),
                      ],
                      onChanged: (v) {
                        setState(() {
                          _selectedWilayahFilter = v;
                        });
                        _loadData(reset: true);
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
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
                          onPressed: () => _loadData(reset: true),
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
                : RefreshIndicator(
                    color: _kNavy,
                    onRefresh: () => _loadData(reset: true),
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.fromLTRB(16, 4, 16, 90),
                      itemCount: _daftarAkun.length + (_hasMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index >= _daftarAkun.length) {
                          return const Center(
                            child: Padding(
                              padding: EdgeInsets.all(16),
                              child: CircularProgressIndicator(color: _kNavy),
                            ),
                          );
                        }

                        final akun = _daftarAkun[index];
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
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          width: 46,
                                          height: 46,
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFE6F1FB),
                                            borderRadius: BorderRadius.circular(
                                              8,
                                            ),
                                            border: Border.all(
                                              color: const Color(0xFFBBD6EE),
                                            ),
                                          ),
                                          child: const Center(
                                            child: Text(
                                              'P',
                                              style: TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold,
                                                color: _kNavy,
                                              ),
                                            ),
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
                                              _resetPassword(akun);
                                            else if (v == 'delete')
                                              _toggleAktif(akun);
                                          },
                                          itemBuilder: (_) => const [
                                            PopupMenuItem(
                                              value: 'edit',
                                              child: ListTile(
                                                leading: Icon(
                                                  Icons.edit_outlined,
                                                  color: _kNavy,
                                                ),
                                                title: Text(
                                                  'Edit / Reset Password',
                                                ),
                                                contentPadding: EdgeInsets.zero,
                                              ),
                                            ),
                                            PopupMenuItem(
                                              value: 'delete',
                                              child: ListTile(
                                                leading: Icon(
                                                  Icons.block_outlined,
                                                  color: Color(0xFFB3261E),
                                                ),
                                                title: Text(
                                                  'Nonaktifkan / Hapus',
                                                ),
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
                                                    akun['nip']
                                                        .toString()
                                                        .isNotEmpty)
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
                                              borderRadius:
                                                  BorderRadius.circular(6),
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
                            .fade(
                              duration: 300.ms,
                              delay: ((index % 10) * 40).ms,
                            )
                            .slideY(
                              begin: 0.05,
                              duration: 300.ms,
                              curve: Curves.easeOutQuad,
                            );
                      },
                    ),
                  ),
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
