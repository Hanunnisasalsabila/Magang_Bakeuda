import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:convert';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';
import '../services/objek_pajak_service.dart';

class DetailObjekPajakScreen extends StatefulWidget {
  final String nop;

  const DetailObjekPajakScreen({super.key, required this.nop});

  @override
  State<DetailObjekPajakScreen> createState() => _DetailObjekPajakScreenState();
}

class _DetailObjekPajakScreenState extends State<DetailObjekPajakScreen> {
  final _service = ObjekPajakService(ApiService());

  Map<String, dynamic>? _data;
  bool _isLoading = true;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      final data = await _service.getDetail(widget.nop);
      setState(() => _data = data);
    } catch (e) {
      setState(() => _errorMsg = 'Gagal memuat detail objek pajak');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  String _fmtCurrency(dynamic val) {
    if (val == null) return '-';
    try {
      final num = double.parse(val.toString());
      return NumberFormat.currency(locale: 'id', symbol: 'Rp ', decimalDigits: 0).format(num);
    } catch (_) {
      return val.toString();
    }
  }

  String _fmtNumber(dynamic val) {
    if (val == null) return '0';
    try {
      final num = double.parse(val.toString());
      if (num == num.truncateToDouble()) return num.toInt().toString();
      return NumberFormat('#,##0.##', 'id').format(num);
    } catch (_) {
      return val.toString();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        title: const Text('Detail Objek Pajak'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMsg != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error_outline, size: 48, color: theme.colorScheme.error),
                      const SizedBox(height: 12),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(_errorMsg!, textAlign: TextAlign.center),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _loadDetail,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Coba Lagi'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadDetail,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMapCard(theme),
                        const SizedBox(height: 16),
                        _buildHeaderCard(theme),
                        const SizedBox(height: 16),
                        _buildSubjekPajakCard(theme),
                        const SizedBox(height: 16),
                        _buildLokasiCard(theme),
                        const SizedBox(height: 16),
                        _buildTanahCard(theme),
                        const SizedBox(height: 16),
                        _buildBangunanCard(theme),
                        const SizedBox(height: 16),
                        _buildNjopCard(theme),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
    );
  }

  // ─────────────────────────────────────────
  // MAP CARD — Peta Lokasi
  // ─────────────────────────────────────────
  Widget _buildMapCard(ThemeData theme) {
    final d = _data!;
    final poly = d['koordinat_polygon'];
    List<LatLng>? polygonPoints;
    LatLng? singlePoint;
    LatLng center = const LatLng(-7.3906, 109.3647); // Default Purbalingga
    bool isValid = false;

    if (poly != null) {
      try {
        final List<LatLng> pts = [];
        
        void flatten(dynamic arr) {
          if (arr is Map && arr.containsKey('lat') && arr.containsKey('lng')) {
            pts.add(LatLng(
              double.parse(arr['lat'].toString()),
              double.parse(arr['lng'].toString()),
            ));
          } else if (arr is List) {
            if (arr.length == 2 && arr[0] is num && arr[1] is num) {
              // GeoJSON format is [longitude, latitude]
              pts.add(LatLng(
                (arr[1] as num).toDouble(),
                (arr[0] as num).toDouble(),
              ));
            } else {
              for (final item in arr) {
                flatten(item);
              }
            }
          }
        }
        
        flatten(poly);
        
        if (pts.isNotEmpty) {
          if (pts.length >= 3) {
            polygonPoints = pts;
          } else {
            singlePoint = pts.first;
          }
          double sumLat = 0;
          double sumLng = 0;
          for (final p in pts) {
            sumLat += p.latitude;
            sumLng += p.longitude;
          }
          center = LatLng(sumLat / pts.length, sumLng / pts.length);
          isValid = true;
        }
      } catch (e) {
        // ignore parse error
      }
    }

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: 220,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Stack(
          children: [
            FlutterMap(
              options: MapOptions(
                initialCenter: center,
                initialZoom: isValid ? 17.0 : 12.0,
                interactionOptions: const InteractionOptions(
                  flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.bakeuda.pbb',
                ),
                if (polygonPoints != null)
                  PolygonLayer(
                    polygons: [
                      Polygon(
                        points: polygonPoints,
                        color: Colors.green.withValues(alpha: 0.3),
                        borderColor: Colors.green,
                        borderStrokeWidth: 2,
                        isFilled: true,
                      ),
                    ],
                  ),
                if (singlePoint != null)
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: singlePoint,
                        width: 40,
                        height: 40,
                        child: const Icon(Icons.location_on, color: Colors.red, size: 40),
                      ),
                    ],
                  ),
              ],
            ),
            if (!isValid)
              Positioned(
                bottom: 12,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade100,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Koordinat belum tersedia/valid',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.amber.shade800,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // ─────────────────────────────────────────
  // HEADER CARD — NOP + Status
  // ─────────────────────────────────────────

  Widget _buildHeaderCard(ThemeData theme) {
    final d = _data!;
    final isAktif = d['status_aktif'] == true;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [const Color(0xFF0F2C59), const Color(0xFF1A3F7D)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F2C59).withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.description, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'NOMOR OBJEK PAJAK',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: (isAktif ? Colors.green : Colors.red).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: (isAktif ? Colors.green : Colors.red).withValues(alpha: 0.5)),
                ),
                child: Text(
                  isAktif ? 'AKTIF' : 'NONAKTIF',
                  style: TextStyle(
                    color: isAktif ? Colors.green.shade200 : Colors.red.shade200,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            d['nop']?.toString() ?? '-',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
              letterSpacing: 1.5,
            ),
          ),
          if (d['wilayah'] != null) ...[
            const SizedBox(height: 6),
            Text(
              '${d['wilayah']['nama_desa'] ?? ''}, Kec. ${d['wilayah']['kecamatan'] ?? ''}',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 12,
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─────────────────────────────────────────
  // SUBJEK PAJAK CARD
  // ─────────────────────────────────────────

  Widget _buildSubjekPajakCard(ThemeData theme) {
    final sp = _data?['subjek_pajak'] as Map<String, dynamic>?;

    return _buildSection(
      icon: Icons.person,
      iconColor: theme.colorScheme.primary,
      title: 'Subjek Pajak (Pemilik)',
      children: [
        _buildDetailRow('Nama', sp?['nama_subjek']?.toString() ?? '-'),
        _buildDetailRow('NIK', sp?['nik']?.toString() ?? '-', isMono: true),
        _buildDetailRow('Status WP', sp?['status_wp']?.toString() ?? '-'),
        _buildDetailRow('No. HP', sp?['no_hp']?.toString() ?? '-'),
        _buildDetailRow('Alamat', sp?['alamat_jalan']?.toString() ?? '-'),
      ],
    );
  }

  // ─────────────────────────────────────────
  // LOKASI CARD
  // ─────────────────────────────────────────

  Widget _buildLokasiCard(ThemeData theme) {
    final d = _data!;

    return _buildSection(
      icon: Icons.location_on,
      iconColor: Colors.orange,
      title: 'Lokasi Objek Pajak',
      children: [
        _buildDetailRow('Alamat', d['jalan_op']?.toString() ?? '-'),
        _buildDetailRow('Blok/Kav', d['blok_kav_no']?.toString() ?? '-'),
        _buildDetailRow('RT / RW', 'RT ${d['rt_op'] ?? '-'} / RW ${d['rw_op'] ?? '-'}'),
        _buildDetailRow('No. Persil', d['no_persil']?.toString() ?? '-'),
        _buildDetailRow('Kelurahan', d['wilayah']?['nama_desa']?.toString() ?? '-'),
        _buildDetailRow('Kecamatan', d['wilayah']?['kecamatan']?.toString() ?? '-'),
      ],
    );
  }

  // ─────────────────────────────────────────
  // TANAH CARD
  // ─────────────────────────────────────────

  Widget _buildTanahCard(ThemeData theme) {
    final d = _data!;
    final bumiList = (d['bumi'] as List?) ?? [];

    return _buildSection(
      icon: Icons.landscape,
      iconColor: Colors.green,
      title: 'Informasi Tanah',
      children: [
        _buildDetailRow('Jenis Tanah', (d['jenis_tanah']?.toString() ?? '-').replaceAll('_', ' ')),
        _buildDetailRow('Total Luas Tanah', '${_fmtNumber(d['luas_tanah'])} m²'),
        if (bumiList.isNotEmpty)
          ...bumiList.asMap().entries.map((entry) {
            final idx = entry.key;
            final b = entry.value as Map<String, dynamic>;
            return Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.green.shade100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Detail Bumi #${idx + 1}',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.green.shade700),
                    ),
                    const SizedBox(height: 6),
                    _buildMiniRow('Luas', '${_fmtNumber(b['luas_bumi'])} m²'),
                    _buildMiniRow('Kode ZNT', b['kode_znt']?.toString() ?? '-'),
                    _buildMiniRow('NJOP Bumi', _fmtCurrency(b['nilai_sistem_bumi'])),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  // ─────────────────────────────────────────
  // BANGUNAN CARD
  // ─────────────────────────────────────────

  Widget _buildBangunanCard(ThemeData theme) {
    final d = _data!;
    final bangunanList = (d['bangunan'] as List?) ?? [];

    return _buildSection(
      icon: Icons.home_work,
      iconColor: Colors.blue,
      title: 'Informasi Bangunan (${d['jumlah_bangunan'] ?? 0} unit)',
      children: [
        _buildDetailRow('Total Luas Bangunan', '${_fmtNumber(d['luas_bangunan'])} m²'),
        _buildDetailRow('Jumlah Bangunan', '${d['jumlah_bangunan'] ?? 0} unit'),
        if (bangunanList.isNotEmpty)
          ...bangunanList.asMap().entries.map((entry) {
            final idx = entry.key;
            final b = entry.value as Map<String, dynamic>;
            return Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.blue.shade100),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bangunan #${idx + 1}',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.blue.shade700),
                    ),
                    const SizedBox(height: 6),
                    _buildMiniRow('Luas', '${_fmtNumber(b['luas_bangunan'])} m²'),
                    _buildMiniRow('Kode JPB', b['kode_jpb']?.toString() ?? '-'),
                    _buildMiniRow('Tahun Dibangun', b['tahun_dibangun']?.toString() ?? '-'),
                    _buildMiniRow('Jumlah Lantai', b['jumlah_lantai']?.toString() ?? '-'),
                    _buildMiniRow('Kondisi', b['kondisi_bangunan']?.toString() ?? '-'),
                    _buildMiniRow('Daya Listrik', '${b['daya_listrik_watt'] ?? '-'} Watt'),
                  ],
                ),
              ),
            );
          }),
        if (bangunanList.isEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Center(
              child: Text(
                'Belum ada data bangunan',
                style: TextStyle(color: Colors.grey.shade500, fontSize: 13, fontStyle: FontStyle.italic),
              ),
            ),
          ),
      ],
    );
  }

  // ─────────────────────────────────────────
  // NJOP CARD
  // ─────────────────────────────────────────

  Widget _buildNjopCard(ThemeData theme) {
    final d = _data!;

    return _buildSection(
      icon: Icons.monetization_on,
      iconColor: Colors.amber.shade700,
      title: 'Nilai Jual Objek Pajak (NJOP)',
      children: [
        _buildDetailRow('NJOP Tanah', _fmtCurrency(d['njop_tanah'])),
        _buildDetailRow('NJOP Bangunan', _fmtCurrency(d['njop_bangunan'])),
        const Divider(height: 20),
        _buildDetailRow('NJOP Total', _fmtCurrency(d['njop_total']), isBold: true),
        _buildDetailRow('Tahun Penilaian', d['tahun_penilaian']?.toString() ?? '-'),
      ],
    );
  }

  // ─────────────────────────────────────────
  // REUSABLE WIDGETS
  // ─────────────────────────────────────────

  Widget _buildSection({
    required IconData icon,
    required Color iconColor,
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.grey.shade100)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, size: 16, color: iconColor),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: children,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isMono = false, bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12.5),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                fontSize: isBold ? 14 : 12.5,
                fontFamily: isMono ? 'monospace' : null,
                color: isBold ? const Color(0xFF0F2C59) : null,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          SizedBox(
            width: 95,
            child: Text(label, style: TextStyle(color: Colors.grey.shade600, fontSize: 11)),
          ),
          Expanded(
            child: Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 11)),
          ),
        ],
      ),
    );
  }
}
