import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/objek_pajak_service.dart';

class ManajemenWilayahScreen extends StatefulWidget {
  final bool autoShowAddForm;
  const ManajemenWilayahScreen({super.key, this.autoShowAddForm = false});

  @override
  State<ManajemenWilayahScreen> createState() => _ManajemenWilayahScreenState();
}

class _ManajemenWilayahScreenState extends State<ManajemenWilayahScreen> {
  static const String _semuaKecamatan = 'Semua Kecamatan';

  final _wilayahService = WilayahService(ApiService());
  final _searchController = TextEditingController();
  Timer? _debounce;

  // Data mentah hasil fetch dari database (bukan dummy).
  List<Map<String, dynamic>> _allData = [];
  // Data yang sudah difilter (search + kecamatan) untuk ditampilkan.
  List<Map<String, dynamic>> _filteredData = [];
  List<String> _daftarKecamatan = [_semuaKecamatan];
  String _selectedKecamatan = _semuaKecamatan;

  int _currentPage = 1;
  final int _itemsPerPage = 10;

  bool _isLoading = true;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
    _loadData();
    if (widget.autoShowAddForm) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showFormDialog();
      });
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), _applyFilter);
    setState(() {}); // refresh suffixIcon (tombol clear) secara realtime
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });
    try {
      // Ambil SELURUH data wilayah langsung dari database via API.
      // Pencarian & filter kecamatan diproses di sisi klien supaya responsif,
      // karena total wilayah (±239) masih ringan untuk dimuat sekaligus.
      final data = await _wilayahService.getDaftarWilayah();

      final kecamatanSet = <String>{};
      for (final w in data) {
        final kec = (w['kecamatan'] ?? '').toString().trim();
        if (kec.isNotEmpty) kecamatanSet.add(kec);
      }
      final kecamatanList = kecamatanSet.toList()..sort();

      setState(() {
        _allData = data;
        _daftarKecamatan = [_semuaKecamatan, ...kecamatanList];
        if (!_daftarKecamatan.contains(_selectedKecamatan)) {
          _selectedKecamatan = _semuaKecamatan;
        }
      });
      _applyFilter();
    } on DioException catch (e) {
      setState(() {
        _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data wilayah';
      });
    } catch (e) {
      setState(() {
        _errorMsg = 'Terjadi kesalahan: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _applyFilter() {
    final query = _searchController.text.trim().toLowerCase();

    final filtered = _allData.where((w) {
      final matchKecamatan =
          _selectedKecamatan == _semuaKecamatan ||
          (w['kecamatan']?.toString() == _selectedKecamatan);
      if (!matchKecamatan) return false;
      if (query.isEmpty) return true;

      final namaDesa = (w['nama_desa'] ?? '').toString().toLowerCase();
      final kecamatan = (w['kecamatan'] ?? '').toString().toLowerCase();
      final kodeWilayah = (w['kode_wilayah'] ?? '').toString().toLowerCase();

      return namaDesa.contains(query) ||
          kecamatan.contains(query) ||
          kodeWilayah.contains(query);
    }).toList();

    setState(() {
      _filteredData = filtered;
      _currentPage = 1; // Reset to page 1 on search/filter
    });
  }

  void _showFormDialog({Map<String, dynamic>? existing}) {
    final isEdit = existing != null;
    final kodeWilayahCtrl = TextEditingController(
      text: existing?['kode_wilayah'] ?? '',
    );
    final namDesaCtrl = TextEditingController(
      text: existing?['nama_desa'] ?? '',
    );
    final kecamatanCtrl = TextEditingController(
      text: existing?['kecamatan'] ?? '',
    );
    final kabupatenCtrl = TextEditingController(
      text: existing?['kabupaten'] ?? 'Purbalingga',
    );
    final kodePropinsiCtrl = TextEditingController(
      text: existing?['kode_propinsi'] ?? '33',
    );
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(isEdit ? 'Edit Wilayah' : 'Tambah Wilayah Baru'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!isEdit)
                  _labeledField(
                    'Kode Wilayah (10 digit)',
                    TextFormField(
                      controller: kodeWilayahCtrl,
                      decoration: _dec('3303011001'),
                      keyboardType: TextInputType.number,
                      maxLength: 10,
                      validator: (v) =>
                          v == null || v.length != 10 ? 'Harus 10 digit' : null,
                    ),
                  ),
                _labeledField(
                  'Nama Desa / Kelurahan',
                  TextFormField(
                    controller: namDesaCtrl,
                    decoration: _dec('Contoh: Sidanegara'),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Wajib diisi' : null,
                  ),
                ),
                _labeledField(
                  'Kecamatan',
                  TextFormField(
                    controller: kecamatanCtrl,
                    decoration: _dec('Contoh: Kaligondang'),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Wajib diisi' : null,
                  ),
                ),
                _labeledField(
                  'Kabupaten',
                  TextFormField(
                    controller: kabupatenCtrl,
                    decoration: _dec('Contoh: Purbalingga'),
                  ),
                ),
                _labeledField(
                  'Kode Propinsi (2 digit)',
                  TextFormField(
                    controller: kodePropinsiCtrl,
                    decoration: _dec('33'),
                    keyboardType: TextInputType.number,
                    maxLength: 2,
                  ),
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (!formKey.currentState!.validate()) return;
              Navigator.pop(ctx);

              try {
                if (isEdit) {
                  await _wilayahService
                      .updateWilayah(existing['kode_wilayah'], {
                        'nama_desa': namDesaCtrl.text,
                        'kecamatan': kecamatanCtrl.text,
                        'kabupaten': kabupatenCtrl.text,
                      });
                } else {
                  final kode = kodeWilayahCtrl.text;
                  await _wilayahService.createWilayah({
                    'kode_wilayah': kode,
                    'nama_desa': namDesaCtrl.text,
                    'kode_propinsi': kodePropinsiCtrl.text,
                    'kode_dati2': kode.substring(2, 4),
                    'kode_kecamatan': kode.substring(4, 7),
                    'kode_kelurahan': kode.substring(7, 10),
                    'kecamatan': kecamatanCtrl.text,
                    'kabupaten': kabupatenCtrl.text,
                  });
                }
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        isEdit
                            ? '✅ Wilayah berhasil diperbarui'
                            : '✅ Wilayah berhasil ditambahkan',
                      ),
                    ),
                  );
                  _loadData();
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Gagal menyimpan: $e'),
                      backgroundColor: Theme.of(context).colorScheme.error,
                    ),
                  );
                }
              }
            },
            child: Text(isEdit ? 'Simpan' : 'Tambah'),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmDelete(Map<String, dynamic> wilayah) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Hapus Wilayah?'),
        content: Text(
          'Anda yakin menghapus "${wilayah['nama_desa']}"? Tindakan ini tidak bisa dibatalkan.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );

    if (ok == true && mounted) {
      try {
        await _wilayahService.deleteWilayah(wilayah['kode_wilayah']);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('✅ Wilayah berhasil dihapus')),
          );
          _loadData();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Gagal hapus: $e'),
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
          );
        }
      }
    }
  }

  Widget _labeledField(String label, Widget field) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 8),
          field,
        ],
      ),
    );
  }

  InputDecoration _dec(String hintText) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: const TextStyle(color: Colors.black38, fontSize: 13),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.grey.shade300),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF0C2A5B), width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      counterText: "",
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const Color _kNavy = Color(0xFF0C2A5B);
    const Color _kGold = Color(0xFFC9A227);

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
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.1,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    'Manajemen Wilayah',
                    style: TextStyle(
                      fontSize: 12,
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
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(116),
          child: Container(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
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
                          hintText: 'Cari desa atau kode...',
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
                                    _applyFilter();
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
                            vertical: 10,
                            horizontal: 16,
                          ),
                        ),
                        onSubmitted: (v) => _applyFilter(),
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
                          value: _selectedKecamatan,
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
                          items: _daftarKecamatan.map((kec) {
                            return DropdownMenuItem(
                              value: kec,
                              child: Text(kec, overflow: TextOverflow.ellipsis),
                            );
                          }).toList(),
                          onChanged: (v) {
                            if (v == null) return;
                            setState(() {
                              _selectedKecamatan = v;
                            });
                            _applyFilter();
                          },
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Menampilkan ${_filteredData.length} dari ${_allData.length} wilayah terdaftar',
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
      body: _buildBody(theme),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showFormDialog,
        backgroundColor: _kNavy,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Tambah Wilayah',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildBody(ThemeData theme) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMsg != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 48,
                color: theme.colorScheme.error,
              ),
              const SizedBox(height: 8),
              Text(_errorMsg!, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadData,
                icon: const Icon(Icons.refresh),
                label: const Text('Coba Lagi'),
              ),
            ],
          ),
        ),
      );
    }

    final totalPages = (_filteredData.length / _itemsPerPage).ceil();
    final startIndex = (_currentPage - 1) * _itemsPerPage;
    final endIndex = (startIndex + _itemsPerPage < _filteredData.length)
        ? startIndex + _itemsPerPage
        : _filteredData.length;
    final paginatedData = _filteredData.sublist(startIndex, endIndex);

    return _filteredData.isEmpty
        ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.map_outlined,
                  size: 64,
                  color: theme.colorScheme.onSurfaceVariant.withValues(
                    alpha: 0.5,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Tidak ada wilayah ditemukan',
                  style: TextStyle(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          )
        : Column(
            children: [
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _loadData,
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                    itemCount: paginatedData.length,
                    itemBuilder: (context, index) {
                      final w = paginatedData[index];
                      return _buildWilayahCard(theme, w, index);
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

  Widget _buildWilayahCard(ThemeData theme, Map<String, dynamic> w, int index) {
    final namaDesa = (w['nama_desa'] ?? '-').toString();
    final kecamatan = (w['kecamatan'] ?? '-').toString();
    final kabupaten = (w['kabupaten'] ?? '').toString();
    final kodeWilayah = (w['kode_wilayah'] ?? '-').toString();
    return Container(
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: Material(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            child: InkWell(
              borderRadius: BorderRadius.circular(14),
              onTap: () => _showFormDialog(existing: w),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primaryContainer.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.location_on,
                        color: theme.colorScheme.primary,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            namaDesa,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            kabupaten.isNotEmpty
                                ? 'Kec. $kecamatan • Kab. $kabupaten'
                                : 'Kec. $kecamatan',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.surfaceContainerHighest,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(
                                color: theme.colorScheme.outlineVariant
                                    .withValues(alpha: 0.5),
                              ),
                            ),
                            child: Text(
                              kodeWilayah,
                              style: const TextStyle(
                                fontSize: 11,
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuButton<String>(
                      icon: Icon(
                        Icons.more_vert,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      onSelected: (v) {
                        if (v == 'edit') _showFormDialog(existing: w);
                        if (v == 'delete') _confirmDelete(w);
                      },
                      itemBuilder: (_) => const [
                        PopupMenuItem(
                          value: 'edit',
                          child: ListTile(
                            leading: Icon(Icons.edit_outlined),
                            title: Text('Edit'),
                          ),
                        ),
                        PopupMenuItem(
                          value: 'delete',
                          child: ListTile(
                            leading: Icon(Icons.delete_outline),
                            title: Text('Hapus'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
        .animate()
        .fade(duration: 350.ms, delay: ((index % 15) * 40).ms)
        .slideY(begin: 0.08, duration: 350.ms, curve: Curves.easeOutQuad);
  }
}
