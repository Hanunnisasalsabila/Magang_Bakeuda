import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/subjek_pajak_service.dart';
import 'detail_objek_pajak_screen.dart';

class DetailSubjekPajakScreen extends StatefulWidget {
  final String nik;

  const DetailSubjekPajakScreen({super.key, required this.nik});

  @override
  State<DetailSubjekPajakScreen> createState() => _DetailSubjekPajakScreenState();
}

class _DetailSubjekPajakScreenState extends State<DetailSubjekPajakScreen> {
  final _service = SubjekPajakService(ApiService());

  Map<String, dynamic>? _subjek;
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
      final data = await _service.getDetail(widget.nik);
      setState(() => _subjek = data);
    } catch (e) {
      setState(() => _errorMsg = 'Gagal memuat detail subjek pajak');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Color _getStatusColor(String? status) {
    switch (status?.toUpperCase()) {
      case 'PEMILIK':
        return Colors.green;
      case 'PENYEWA':
        return Colors.purple;
      case 'PENGELOLA':
        return Colors.amber.shade700;
      case 'PEMAKAI':
        return Colors.cyan.shade700;
      case 'SENGKETA':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        title: const Text('Detail Subjek Pajak'),
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
                        _buildSubjekInfoCard(theme),
                        const SizedBox(height: 20),
                        _buildObjekPajakSection(theme),
                      ],
                    ),
                  ),
                ),
    );
  }

  // ─────────────────────────────────────────
  // SECTION 1: Informasi Subjek Pajak
  // ─────────────────────────────────────────

  Widget _buildSubjekInfoCard(ThemeData theme) {
    final s = _subjek!;
    final statusWp = s['status_wp']?.toString() ?? '-';
    final statusColor = _getStatusColor(statusWp);

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
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.grey.shade100)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(Icons.person, color: theme.colorScheme.primary, size: 20),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Informasi Subjek Pajak',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    statusWp.toUpperCase(),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildInfoRow(Icons.person_outline, 'Nama Wajib Pajak', s['nama_subjek']?.toString() ?? '-'),
                _buildInfoRow(Icons.badge_outlined, 'NIK', s['nik']?.toString() ?? '-', isMono: true),
                _buildInfoRow(Icons.work_outline, 'Pekerjaan', s['pekerjaan']?.toString() ?? '-'),
                _buildInfoRow(Icons.phone_outlined, 'No. HP', s['no_hp']?.toString() ?? '-'),
                _buildInfoRow(Icons.email_outlined, 'Email', s['email']?.toString() ?? '-'),
                _buildInfoRow(Icons.receipt_long_outlined, 'NPWP', s['npwp']?.toString() ?? '-', isMono: true),
                _buildInfoRow(Icons.receipt_outlined, 'NPWPD', s['npwpd']?.toString() ?? '-', isMono: true),
                const Divider(height: 24),
                _buildInfoRow(
                  Icons.location_on_outlined,
                  'Alamat',
                  _buildAlamatText(s),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _buildAlamatText(Map<String, dynamic> s) {
    final parts = <String>[];
    final jalan = s['alamat_jalan']?.toString();
    if (jalan != null && jalan.isNotEmpty) parts.add(jalan);

    final blok = s['blok_kav_no_subjek']?.toString();
    if (blok != null && blok.isNotEmpty) parts.add('Blok/Kav: $blok');

    final rt = s['rt']?.toString() ?? '';
    final rw = s['rw']?.toString() ?? '';
    if (rt.isNotEmpty || rw.isNotEmpty) parts.add('RT $rt / RW $rw');

    final kel = s['kelurahan_wp']?.toString();
    if (kel != null && kel.isNotEmpty) parts.add('Kel. $kel');

    final kec = s['kecamatan_wp']?.toString();
    if (kec != null && kec.isNotEmpty) parts.add('Kec. $kec');

    final kab = s['kabupaten_wp']?.toString();
    if (kab != null && kab.isNotEmpty) parts.add(kab);

    final kodePos = s['kode_pos']?.toString();
    if (kodePos != null && kodePos.isNotEmpty) parts.add('Kode Pos: $kodePos');

    return parts.isNotEmpty ? parts.join(', ') : '-';
  }

  Widget _buildInfoRow(IconData icon, String label, String value, {bool isMono = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: Colors.grey.shade500),
          const SizedBox(width: 10),
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 12.5,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 12.5,
                fontFamily: isMono ? 'monospace' : null,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────
  // SECTION 2: Daftar Objek Pajak Dimiliki
  // ─────────────────────────────────────────

  Widget _buildObjekPajakSection(ThemeData theme) {
    final objekList = (_subjek?['objek_pajak'] as List?) ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.real_estate_agent, size: 20, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            Text(
              'Objek Pajak Dimiliki (${objekList.length})',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (objekList.isEmpty)
          _buildEmptyObjekState(theme)
        else
          ...objekList.asMap().entries.map((entry) {
            final idx = entry.key;
            final op = entry.value as Map<String, dynamic>;
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildObjekPajakCard(op, idx, objekList.length, theme),
            );
          }),
      ],
    );
  }

  Widget _buildEmptyObjekState(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.home_work_outlined, size: 32, color: Colors.grey.shade400),
          ),
          const SizedBox(height: 16),
          const Text(
            'Tidak Ada Objek Pajak',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          const SizedBox(height: 4),
          Text(
            'Subjek pajak ini belum memiliki\nobjek pajak yang terdaftar.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildObjekPajakCard(Map<String, dynamic> op, int idx, int total, ThemeData theme) {
    final nop = op['nop']?.toString() ?? '-';
    final isAktif = op['status_aktif'] != false;
    final jalan = op['jalan_op']?.toString() ?? '-';
    final rt = op['rt_op']?.toString() ?? '';
    final rw = op['rw_op']?.toString() ?? '';
    final desa = op['wilayah']?['nama_desa']?.toString() ?? '';
    final kecamatan = op['wilayah']?['kecamatan']?.toString() ?? '';
    final jenisTanah = op['jenis_tanah']?.toString().replaceAll('_', ' ') ?? '-';
    final luasTanah = op['luas_tanah']?.toString() ?? '0';
    final luasBangunan = op['luas_bangunan']?.toString() ?? '0';
    final jmlBangunan = op['jumlah_bangunan']?.toString() ?? '0';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => DetailObjekPajakScreen(nop: nop),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
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
                      color: Colors.green.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.landscape, size: 16, color: Colors.green),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          total > 1 ? 'Objek Pajak #${idx + 1}' : 'Objek Pajak',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'NOP: $nop',
                          style: TextStyle(
                            fontSize: 11,
                            fontFamily: 'monospace',
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: (isAktif ? Colors.green : Colors.red).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      isAktif ? 'Aktif' : 'Tidak Aktif',
                      style: TextStyle(
                        color: isAktif ? Colors.green.shade700 : Colors.red.shade700,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Body
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                children: [
                  _buildObjekInfoRow('Alamat', '$jalan${(rt.isNotEmpty || rw.isNotEmpty) ? ' RT $rt/RW $rw' : ''}${desa.isNotEmpty ? ', Kel. ${desa.toUpperCase()}' : ''}${kecamatan.isNotEmpty ? ', Kec. ${kecamatan.toUpperCase()}' : ''}'),
                  _buildObjekInfoRow('Jenis Tanah', jenisTanah[0].toUpperCase() + jenisTanah.substring(1).toLowerCase()),
                  const SizedBox(height: 8),
                  // Stats row
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        _buildStatItem('Luas Tanah', '$luasTanah m²'),
                        Container(width: 1, height: 28, color: Colors.grey.shade300),
                        _buildStatItem('Luas Bgn', '$luasBangunan m²'),
                        Container(width: 1, height: 28, color: Colors.grey.shade300),
                        _buildStatItem('Jml Bgn', '$jmlBangunan unit'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Lihat Detail',
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_forward_ios, size: 12, color: theme.colorScheme.primary),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildObjekInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 85,
            child: Text(
              label,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Expanded(
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
          ),
        ],
      ),
    );
  }
}
