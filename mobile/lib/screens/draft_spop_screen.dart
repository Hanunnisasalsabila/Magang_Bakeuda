import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import '../services/transaksi_spop_service.dart';
import 'spop_form_screen.dart';

const Color _kNavy = Color(0xFF0F2C59);

class DraftSpopScreen extends StatefulWidget {
  const DraftSpopScreen({super.key});

  @override
  State<DraftSpopScreen> createState() => _DraftSpopScreenState();
}

class _DraftSpopScreenState extends State<DraftSpopScreen> {
  final _spopService = TransaksiSpopService(ApiService());
  bool _isLoading = true;
  String? _errorMsg;
  List<Map<String, dynamic>> _allDrafts = [];
  List<Map<String, dynamic>> _drafts = [];
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadDrafts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterDrafts() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      if (query.isEmpty) {
        _drafts = List.from(_allDrafts);
      } else {
        _drafts = _allDrafts.where((e) {
          final name = e['name'].toString().toLowerCase();
          final nop = e['nop'].toString().toLowerCase();
          return name.contains(query) || nop.contains(query);
        }).toList();
      }
    });
  }

  Future<void> _loadDrafts() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      final raw = await _spopService.getTransaksiSaya();
      
      final mapped = <Map<String, dynamic>>[];
      
      for (var item in raw) {
        if (item is! Map<String, dynamic>) continue;
        if (item['status_ajuan'] != 'DRAFT') continue;
        
        final idTransaksi = item['id_transaksi']?.toString() ?? item['id']?.toString() ?? '';
        
        String name = 'Nama Belum Diisi';
        String nop = 'Menunggu NOP';
        
        if (item['jenis_transaksi'] == 'HAPUS') {
          final detailAsal = item['detail_asal'] as List<dynamic>?;
          if (detailAsal != null && detailAsal.isNotEmpty) {
            final detail = detailAsal[0] as Map<String, dynamic>;
            name = item['nama_pengaju'] ?? detail['nama_pengaju'] ?? 'Nama Belum Diisi';
            nop = detail['nop_asal'] ?? 'Menunggu NOP';
          }
        } else {
          final detailTujuan = item['detail_tujuan'] as List<dynamic>?;
          if (detailTujuan != null && detailTujuan.isNotEmpty) {
            final detail = detailTujuan[0] as Map<String, dynamic>;
            name = item['nama_pengaju'] ?? detail['nama_pengaju'] ?? '';
            if (name.isEmpty) name = detail['calon_subjek_json']?['nama_subjek'] ?? 'Nama Belum Diisi';
            nop = detail['nop_generated'] ?? detail['no_persil_baru'] ?? 'Menunggu NOP';
          }
        }
        
        mapped.add({
          'id': idTransaksi,
          'jenis_transaksi': item['jenis_transaksi'] ?? 'BARU',
          'name': name,
          'nop': nop,
          'date': item['created_at'],
        });
      }

      _allDrafts = mapped;
      _filterDrafts();
    } on DioException catch (e) {
      setState(() => _errorMsg = e.response?.data?['message'] ?? e.message);
    } catch (e) {
      setState(() => _errorMsg = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _deleteDraft(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Hapus Draft?'),
        content: const Text('Apakah Anda yakin ingin menghapus Draft ini? Seluruh data form yang tersimpan akan dihapus permanen dan tidak dapat dikembalikan.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Batal', style: TextStyle(color: Colors.grey)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Hapus', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Menghapus draft...')));
      await _spopService.deleteTransaksi(id);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Draft berhasil dihapus.')));
      _loadDrafts();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal menghapus draft.')));
    }
  }

  String _fmtDate(String? iso) {
    if (iso == null) return '-';
    try { return DateFormat('dd MMM yyyy', 'id').format(DateTime.parse(iso).toLocal()); } catch(_) { return iso; }
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.description_outlined, size: 80, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          const Text('Tidak ada Draft', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87)),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              'Anda belum memiliki pengajuan SPOP yang tersimpan sebagai draft.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDraftCard(Map<String, dynamic> d) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    d['jenis_transaksi'],
                    style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'DRAFT',
                    style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              d['name'],
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black87),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.numbers, size: 14, color: Colors.grey.shade500),
                const SizedBox(width: 4),
                Text(
                  d['nop'],
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontFamily: 'monospace', fontWeight: FontWeight.w600),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 14, color: Colors.grey.shade500),
                    const SizedBox(width: 4),
                    Text(
                      _fmtDate(d['date']),
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                  ],
                ),
                Row(
                  children: [
                    InkWell(
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SpopFormScreen(idTransaksi: d['id']),
                          ),
                        );
                        _loadDrafts(); // Reload after back
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.green.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.edit, size: 18, color: Colors.green),
                      ),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      onTap: () => _deleteDraft(d['id']),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.red.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F9),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => _filterDrafts(),
              style: const TextStyle(fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Cari NOP/Nama...',
                prefixIcon: const Icon(Icons.search, size: 20, color: Colors.grey),
                isDense: true,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: _kNavy),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _errorMsg != null
                    ? Center(child: Text(_errorMsg!, style: const TextStyle(color: Colors.red)))
                    : RefreshIndicator(
                        onRefresh: _loadDrafts,
                        child: _drafts.isEmpty
                            ? ListView(
                                physics: const AlwaysScrollableScrollPhysics(),
                                children: [
                                  SizedBox(
                                    height: MediaQuery.of(context).size.height - 300,
                                    child: _buildEmptyState(),
                                  ),
                                ],
                              )
                            : ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
                                physics: const AlwaysScrollableScrollPhysics(),
                                itemCount: _drafts.length,
                                itemBuilder: (context, index) {
                                  return _buildDraftCard(_drafts[index]);
                                },
                              ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const SpopFormScreen()),
          );
          _loadDrafts(); // Reload after creating new
        },
        backgroundColor: _kNavy,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Buat Baru', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
