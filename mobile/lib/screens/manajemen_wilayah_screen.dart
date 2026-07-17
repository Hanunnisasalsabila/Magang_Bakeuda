import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/objek_pajak_service.dart';

class ManajemenWilayahScreen extends StatefulWidget {
  const ManajemenWilayahScreen({super.key});

  @override
  State<ManajemenWilayahScreen> createState() => _ManajemenWilayahScreenState();
}

class _ManajemenWilayahScreenState extends State<ManajemenWilayahScreen> {
  final _wilayahService = WilayahService(ApiService());
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _data = [];
  bool _isLoading = true;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() { _isLoading = true; _errorMsg = null; });
    try {
      final data = await _wilayahService.getDaftarWilayah(
        search: _searchController.text.isNotEmpty ? _searchController.text : null,
      );
      setState(() { _data = data; });
    } on DioException catch (e) {
      setState(() { _errorMsg = e.response?.data?['message'] ?? 'Gagal memuat data'; });
    } catch (e) {
      setState(() { _errorMsg = 'Error: $e'; });
    } finally {
      setState(() { _isLoading = false; });
    }
  }

  void _showFormDialog({Map<String, dynamic>? existing}) {
    final isEdit = existing != null;
    final kodeWilayahCtrl = TextEditingController(text: existing?['kode_wilayah'] ?? '');
    final namDesaCtrl = TextEditingController(text: existing?['nama_desa'] ?? '');
    final kecamatanCtrl = TextEditingController(text: existing?['kecamatan'] ?? '');
    final kabupatenCtrl = TextEditingController(text: existing?['kabupaten'] ?? 'Purbalingga');
    final kodePropinsiCtrl = TextEditingController(text: existing?['kode_propinsi'] ?? '33');
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(isEdit ? 'Edit Wilayah' : 'Tambah Wilayah Baru'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!isEdit)
                  TextFormField(
                    controller: kodeWilayahCtrl,
                    decoration: _dec('Kode Wilayah (10 digit)', hintText: '3303011001'),
                    keyboardType: TextInputType.number,
                    maxLength: 10,
                    validator: (v) => v == null || v.length != 10 ? 'Harus 10 digit' : null,
                  ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: namDesaCtrl,
                  decoration: _dec('Nama Desa / Kelurahan'),
                  validator: (v) => v == null || v.isEmpty ? 'Wajib diisi' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: kecamatanCtrl,
                  decoration: _dec('Kecamatan'),
                  validator: (v) => v == null || v.isEmpty ? 'Wajib diisi' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: kabupatenCtrl,
                  decoration: _dec('Kabupaten'),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: kodePropinsiCtrl,
                  decoration: _dec('Kode Propinsi (2 digit)'),
                  keyboardType: TextInputType.number,
                  maxLength: 2,
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              if (!formKey.currentState!.validate()) return;
              Navigator.pop(ctx);

              try {
                if (isEdit) {
                  await _wilayahService.updateWilayah(
                    existing!['kode_wilayah'],
                    {
                      'nama_desa': namDesaCtrl.text,
                      'kecamatan': kecamatanCtrl.text,
                      'kabupaten': kabupatenCtrl.text,
                    },
                  );
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
                    SnackBar(content: Text(isEdit ? '✅ Wilayah berhasil diperbarui' : '✅ Wilayah berhasil ditambahkan')),
                  );
                  _loadData();
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Gagal menyimpan: $e'), backgroundColor: Theme.of(context).colorScheme.error),
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
        title: const Text('Hapus Wilayah?'),
        content: Text('Anda yakin menghapus "${wilayah['nama_desa']}"? Tindakan ini tidak bisa dibatalkan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );

    if (ok == true && mounted) {
      try {
        await _wilayahService.deleteWilayah(wilayah['kode_wilayah']);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('✅ Wilayah berhasil dihapus')));
          _loadData();
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal hapus: $e'), backgroundColor: Theme.of(context).colorScheme.error),
          );
        }
      }
    }
  }

  InputDecoration _dec(String label, {String? hintText}) {
    return InputDecoration(
      labelText: label,
      hintText: hintText,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manajemen Wilayah'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(68),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari desa atau kecamatan...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchController.clear(); _loadData(); })
                    : null,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                filled: true,
                fillColor: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onSubmitted: (_) => _loadData(),
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
                      Text(_errorMsg!),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(onPressed: _loadData, icon: const Icon(Icons.refresh), label: const Text('Coba Lagi')),
                    ],
                  ),
                )
              : _data.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.map_outlined, size: 64, color: theme.colorScheme.onSurfaceVariant.withValues(alpha: 0.5)),
                          const SizedBox(height: 16),
                          Text('Tidak ada wilayah ditemukan', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _data.length,
                        itemBuilder: (context, index) {
                          final w = _data[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                            color: theme.colorScheme.surface,
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              leading: CircleAvatar(
                                backgroundColor: theme.colorScheme.primaryContainer,
                                child: Text(
                                  w['nama_desa']?.toString().substring(0, 1).toUpperCase() ?? 'W',
                                  style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold),
                                ),
                              ),
                              title: Text(w['nama_desa'] ?? '-', style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('Kec. ${w['kecamatan'] ?? '-'} • ${w['kode_wilayah'] ?? '-'}',
                                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                              trailing: PopupMenuButton<String>(
                                icon: const Icon(Icons.more_vert),
                                onSelected: (v) {
                                  if (v == 'edit') _showFormDialog(existing: w);
                                  if (v == 'delete') _confirmDelete(w);
                                },
                                itemBuilder: (_) => [
                                  const PopupMenuItem(value: 'edit', child: ListTile(leading: Icon(Icons.edit_outlined), title: Text('Edit'))),
                                  const PopupMenuItem(value: 'delete', child: ListTile(leading: Icon(Icons.delete_outline), title: Text('Hapus'))),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showFormDialog(),
        icon: const Icon(Icons.add),
        label: const Text('Tambah Wilayah'),
      ),
    );
  }
}
