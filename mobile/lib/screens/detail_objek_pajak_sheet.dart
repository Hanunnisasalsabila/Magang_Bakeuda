import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'dart:typed_data';
import 'package:flutter/services.dart' show rootBundle;
import 'spop_form_screen.dart';

class DetailObjekPajakSheet extends StatelessWidget {
  final Map<String, dynamic> item;

  const DetailObjekPajakSheet({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    final isAktif = item['status_aktif'] == true;

    Widget _buildRow(IconData icon, String label, String value, {bool isMono = false}) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 16, color: Colors.grey.shade500),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: Text(label, style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
            ),
            Expanded(
              flex: 3,
              child: Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  fontFamily: isMono ? 'monospace' : null,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.blue.withValues(alpha: 0.1), shape: BoxShape.circle),
                child: const Icon(Icons.description, color: Colors.blue, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('INFORMASI OBJEK PAJAK', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    const SizedBox(height: 2),
                    Text('NOP: ${item['nop'] ?? '-'}', style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold, fontSize: 12, fontFamily: 'monospace')),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade200),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                _buildRow(Icons.person, 'Nama Pemilik', item['subjek_pajak']?['nama_subjek'] ?? 'Tanpa Nama'),
                const Divider(),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline, size: 16, color: Colors.grey.shade500),
                      const SizedBox(width: 8),
                      Expanded(flex: 2, child: Text('Status Pajak', style: TextStyle(color: Colors.grey.shade700, fontSize: 13))),
                      Expanded(
                        flex: 3,
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isAktif ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              isAktif ? 'Aktif' : 'Nonaktif',
                              style: TextStyle(color: isAktif ? Colors.green : Colors.red, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const Divider(),
                _buildRow(Icons.signpost, 'Alamat Jalan', '${item['jalan_op'] ?? ''} RT ${item['rt_op'] ?? ''}/RW ${item['rw_op'] ?? ''}'.trim()),
                const Divider(),
                _buildRow(Icons.location_city, 'Desa / Kelurahan', item['wilayah']?['nama_desa'] ?? '-'),
                const Divider(),
                _buildRow(Icons.holiday_village, 'Kecamatan', item['wilayah']?['kecamatan'] ?? '-'),
                const Divider(),
                _buildRow(Icons.landscape, 'Luas Tanah', '${item['luas_tanah'] ?? 0} m²', isMono: true),
                const Divider(),
                _buildRow(Icons.home_work, 'Luas Bangunan', '${item['luas_bangunan'] ?? 0} m²', isMono: true),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: isAktif ? () {
                    Navigator.pop(context);
                    showDialog(context: context, builder: (_) => CetakSpptDialog(item: item));
                  } : null,
                  icon: const Icon(Icons.print, size: 18),
                  label: const Text('Cetak Objek Pajak'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(color: isAktif ? Colors.grey.shade300 : Colors.grey.shade200),
                    foregroundColor: Colors.grey.shade800,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: isAktif ? () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const SpopFormScreen()));
                  } : null,
                  icon: const Icon(Icons.edit_document, size: 18),
                  label: const Text('Perubahan'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    backgroundColor: Colors.blue.shade600,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class CetakSpptDialog extends StatefulWidget {
  final Map<String, dynamic> item;
  const CetakSpptDialog({super.key, required this.item});

  @override
  State<CetakSpptDialog> createState() => _CetakSpptDialogState();
}

class _CetakSpptDialogState extends State<CetakSpptDialog> {
  String nomorSurat = '';
  String namaPejabat = '';
  String nip = '';

  Future<void> _generatePdf() async {
    if (namaPejabat.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nama Pejabat Penandatangan wajib diisi')));
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sedang menyiapkan dokumen...')));
    Navigator.pop(context);

    final doc = pw.Document();
    
    // Fallback if image fails to load
    pw.ImageProvider? logoImage;
    try {
      final logoBytes = await rootBundle.load('assets/logo-purbalingga.png');
      logoImage = pw.MemoryImage(logoBytes.buffer.asUint8List());
    } catch (_) {}

    final bulanRomawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][DateTime.now().month - 1];
    final tahun = DateTime.now().year;
    final nomorDisplay = nomorSurat.isNotEmpty
        ? 'NOMOR : 900.1 / $nomorSurat / BKD-PBB / $bulanRomawi / $tahun'
        : 'NOMOR : 900.1 / ......... / BKD-PBB / $bulanRomawi / $tahun';

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(30),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.center,
                children: [
                  if (logoImage != null) pw.Container(width: 70, height: 70, child: pw.Image(logoImage)),
                  pw.SizedBox(width: 15),
                  pw.Expanded(
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.center,
                      children: [
                        pw.Text('PEMERINTAH KABUPATEN PURBALINGGA', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
                        pw.Text('BADAN KEUANGAN DAERAH', style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                        pw.Text('Jl. Let. Jend. S. Parman No.1, Purbalingga, Jawa Tengah 53311', style: const pw.TextStyle(fontSize: 10)),
                        pw.Text('Telp. (0281) 891012  |  Fax. (0281) 891042  |  bakeuda.purbalinggakab.go.id', style: const pw.TextStyle(fontSize: 10)),
                      ],
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Divider(thickness: 3),
              pw.SizedBox(height: 1),
              pw.Divider(thickness: 1),
              pw.SizedBox(height: 20),
              pw.Text('SURAT KETERANGAN', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold, decoration: pw.TextDecoration.underline)),
              pw.SizedBox(height: 5),
              pw.Text(nomorDisplay, style: const pw.TextStyle(fontSize: 12)),
              pw.SizedBox(height: 20),
              pw.Text(
                'Yang bertanda tangan di bawah ini, Kepala Badan Keuangan Daerah Kabupaten Purbalingga, dengan ini menerangkan bahwa data Objek Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2) adalah sebagai berikut :',
                style: const pw.TextStyle(fontSize: 12, lineSpacing: 2),
                textAlign: pw.TextAlign.justify,
              ),
              pw.SizedBox(height: 20),
              pw.Padding(
                padding: const pw.EdgeInsets.only(left: 20),
                child: pw.Column(
                  children: [
                    _buildPdfRow('Nama Wajib Pajak', widget.item['subjek_pajak']?['nama_subjek'] ?? '-'),
                    _buildPdfRow('No. Objek Pajak (NOP)', widget.item['nop'] ?? '-'),
                    _buildPdfRow('Luas Tanah / Bumi', '${widget.item['luas_tanah'] ?? 0} m²'),
                    _buildPdfRow('Luas Bangunan', '${widget.item['luas_bangunan'] ?? 0} m²'),
                    _buildPdfRow('Alamat Objek Pajak', [
                      widget.item['jalan_op'],
                      if (widget.item['rt_op'] != null) 'RT ${widget.item['rt_op']}/RW ${widget.item['rw_op']}',
                      if (widget.item['kelurahan_op'] != null) 'Desa ${widget.item['kelurahan_op']}',
                      if (widget.item['kecamatan_op'] != null) 'Kecamatan ${widget.item['kecamatan_op']}',
                    ].where((e) => e != null && e.toString().trim().isNotEmpty).join(', ')),
                  ],
                ),
              ),
              pw.SizedBox(height: 20),
              pw.Text(
                'Demikian Surat Keterangan ini dibuat dengan sebenarnya dan berdasarkan data yang tercatat dalam sistem administrasi PBB-P2 Kabupaten Purbalingga agar dapat dipergunakan sebagaimana mestinya.',
                style: const pw.TextStyle(fontSize: 12, lineSpacing: 2),
                textAlign: pw.TextAlign.justify,
              ),
              pw.SizedBox(height: 40),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.end,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.center,
                    children: [
                      pw.Text('Purbalingga, ${DateTime.now().day} ${_getBulanIndo(DateTime.now().month)} ${DateTime.now().year}', style: const pw.TextStyle(fontSize: 12)),
                      pw.SizedBox(height: 5),
                      pw.Text('Kepala Badan Keuangan Daerah', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                      pw.SizedBox(height: 60), // Signature space
                      pw.Text(namaPejabat, style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold, decoration: pw.TextDecoration.underline)),
                      pw.Text('NIP. $nip', style: const pw.TextStyle(fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
      name: 'Cetak_Objek_Pajak_${widget.item['nop']}.pdf',
    );
  }

  pw.Widget _buildPdfRow(String label, String value) {
    return pw.Padding(
      padding: const pw.EdgeInsets.only(bottom: 8),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Container(width: 150, child: pw.Text(label, style: const pw.TextStyle(fontSize: 12))),
          pw.Text(' :  ', style: const pw.TextStyle(fontSize: 12)),
          pw.Expanded(child: pw.Text(value, style: const pw.TextStyle(fontSize: 12))),
        ],
      ),
    );
  }

  String _getBulanIndo(int month) {
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return bulan[month - 1];
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Colors.white,
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.blue.withValues(alpha: 0.1), shape: BoxShape.circle),
                    child: const Icon(Icons.print, color: Colors.blue, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Cetak Salinan Data', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text('Lengkapi form sebelum mengunduh PDF', style: TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text('NOMOR URUT SURAT (opsional)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 4),
              TextField(
                onChanged: (v) => nomorSurat = v,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: 'mis. 123',
                  prefixText: '900.1 / ',
                  suffixText: ' / BKD-PBB / ...',
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              const Text('NAMA PEJABAT PENANDATANGAN *', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 4),
              TextField(
                onChanged: (v) => setState(() => namaPejabat = v),
                decoration: InputDecoration(
                  hintText: 'Contoh: Drs. Ahmad Fauzi, M.Si.',
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 16),
              const Text('JABATAN', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.grey.shade300)),
                child: Row(
                  children: [
                    Icon(Icons.lock, size: 16, color: Colors.grey.shade400),
                    const SizedBox(width: 8),
                    const Text('Kepala Badan Keuangan Daerah', style: TextStyle(color: Colors.black54)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text('NIP (opsional)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 4),
              TextField(
                onChanged: (v) => nip = v,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: 'Contoh: 197001011999031001',
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Batal', style: TextStyle(color: Colors.grey)),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: namaPejabat.isEmpty ? null : _generatePdf,
                    icon: const Icon(Icons.download, size: 18),
                    label: const Text('Unduh PDF'),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade400, foregroundColor: Colors.white),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
