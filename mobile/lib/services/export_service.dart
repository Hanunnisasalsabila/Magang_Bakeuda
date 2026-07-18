import 'dart:io';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:share_plus/share_plus.dart';
import 'package:open_file/open_file.dart';
import 'package:excel/excel.dart' as xl;

class ExportService {
  // ─── Cetak Kredensial Akun Desa ke PDF ───
  static Future<File> cetakKredensialPdf({
    required String namaDesa,
    required String kecamatan,
    required String username,
    required String passwordAwal,
  }) async {
    final pdf = pw.Document();

    // Load logo if available
    pw.ImageProvider? logoImage;
    try {
      final logoBytes = await rootBundle.load('assets/images/logo.png');
      logoImage = pw.MemoryImage(logoBytes.buffer.asUint8List());
    } catch (_) {}

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a5,
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            // Header
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text('PEMERINTAH KABUPATEN PURBALINGGA',
                        style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
                    pw.Text('BADAN KEUANGAN DAERAH (BAKEUDA)',
                        style: pw.TextStyle(fontSize: 9)),
                  ],
                ),
                if (logoImage != null) pw.Image(logoImage, width: 40, height: 40),
              ],
            ),
            pw.Divider(thickness: 2),
            pw.SizedBox(height: 12),
            pw.Center(
              child: pw.Text('KARTU KREDENSIAL AKUN DESA',
                  style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 14)),
            ),
            pw.SizedBox(height: 4),
            pw.Center(
              child: pw.Text('SIPD Purbalingga – Sistem Pajak Bumi Bangunan',
                  style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
            ),
            pw.SizedBox(height: 20),
            // Info box
            pw.Container(
              padding: const pw.EdgeInsets.all(16),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.blue800),
                borderRadius: pw.BorderRadius.circular(8),
                color: PdfColors.blue50,
              ),
              child: pw.Column(
                children: [
                  _buildKredensialRow('Nama Desa', namaDesa),
                  _buildKredensialRow('Kecamatan', kecamatan),
                  pw.Divider(color: PdfColors.blue200),
                  _buildKredensialRow('Username', username),
                  _buildKredensialRow('Password Awal', passwordAwal),
                ],
              ),
            ),
            pw.SizedBox(height: 16),
            pw.Container(
              padding: const pw.EdgeInsets.all(10),
              decoration: pw.BoxDecoration(
                color: PdfColors.amber50,
                border: pw.Border.all(color: PdfColors.amber700),
                borderRadius: pw.BorderRadius.circular(6),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text('⚠ PENTING:',
                      style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10, color: PdfColors.amber900)),
                  pw.SizedBox(height: 4),
                  pw.Text('• Segera ganti password setelah login pertama kali.',
                      style: const pw.TextStyle(fontSize: 9)),
                  pw.Text('• Jangan berikan kredensial ini kepada pihak yang tidak berwenang.',
                      style: const pw.TextStyle(fontSize: 9)),
                  pw.Text('• Simpan kartu ini di tempat yang aman.',
                      style: const pw.TextStyle(fontSize: 9)),
                ],
              ),
            ),
            pw.Spacer(),
            pw.Divider(),
            pw.Center(
              child: pw.Text(
                'Dicetak pada: ${DateFormat('dd MMMM yyyy, HH:mm', 'id').format(DateTime.now())}',
                style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
              ),
            ),
          ],
        ),
      ),
    );

    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/kredensial_${username}_${DateTime.now().millisecondsSinceEpoch}.pdf');
    await file.writeAsBytes(await pdf.save());
    return file;
  }

  static pw.Widget _buildKredensialRow(String label, String value) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 4),
      child: pw.Row(
        children: [
          pw.SizedBox(
            width: 100,
            child: pw.Text(label, style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
          ),
          pw.Text(': ', style: const pw.TextStyle(fontSize: 10)),
          pw.Expanded(
            child: pw.Text(value, style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
          ),
        ],
      ),
    );
  }

  // ─── Export Daftar Objek Pajak ke Excel ───
  static Future<File> exportObjekPajakExcel(List<Map<String, dynamic>> data) async {
    final excel = xl.Excel.createExcel();
    final sheet = excel['Daftar Objek Pajak'];
    excel.setDefaultSheet('Daftar Objek Pajak');

    // Header row
    final headers = ['NOP', 'Nama WP', 'Alamat OP', 'Luas Tanah', 'Luas Bgn', 'Status', 'Tgl Update'];
    for (var i = 0; i < headers.length; i++) {
      final cell = sheet.cell(xl.CellIndex.indexByColumnRow(columnIndex: i, rowIndex: 0));
      cell.value = xl.TextCellValue(headers[i]);
      cell.cellStyle = xl.CellStyle(bold: true, backgroundColorHex: xl.ExcelColor.fromHexString('#1565C0'), fontColorHex: xl.ExcelColor.fromHexString('#FFFFFF'));
    }

    // Data rows
    for (var i = 0; i < data.length; i++) {
      final d = data[i];
      final rowData = [
        d['nop'] ?? '',
        d['subjek_pajak']?['nama_subjek'] ?? '',
        d['jalan_op'] ?? '',
        '${d['luas_tanah'] ?? 0} m²',
        '${d['luas_bangunan'] ?? 0} m²',
        d['status_aktif'] == true ? 'Aktif' : 'Tidak Aktif',
        d['updated_at'] != null
            ? DateFormat('dd/MM/yyyy').format(DateTime.parse(d['updated_at']))
            : '',
      ];
      for (var j = 0; j < rowData.length; j++) {
        sheet
            .cell(xl.CellIndex.indexByColumnRow(columnIndex: j, rowIndex: i + 1))
            .value = xl.TextCellValue(rowData[j]);
      }
    }

    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/daftar_op_${DateTime.now().millisecondsSinceEpoch}.xlsx');
    final bytes = excel.save();
    if (bytes != null) await file.writeAsBytes(bytes);
    return file;
  }

  // ─── Export Daftar Objek Pajak ke PDF ───
  static Future<File> exportObjekPajakPdf(List<Map<String, dynamic>> data) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4.landscape,
        header: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text('Daftar Objek Pajak Bumi dan Bangunan',
                style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 14)),
            pw.Text('Bakeuda Kab. Purbalingga | ${DateFormat('dd MMMM yyyy', 'id').format(DateTime.now())}',
                style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
            pw.Divider(),
          ],
        ),
        build: (context) => [
          pw.TableHelper.fromTextArray(
            headers: ['No', 'NOP', 'Nama WP', 'Alamat OP', 'Luas Tanah', 'Luas Bgn', 'Status'],
            data: List.generate(data.length, (i) {
              final d = data[i];
              return [
                '${i + 1}',
                d['nop'] ?? '',
                d['subjek_pajak']?['nama_subjek'] ?? '-',
                d['jalan_op'] ?? '-',
                '${d['luas_tanah'] ?? 0} m²',
                '${d['luas_bangunan'] ?? 0} m²',
                d['status_aktif'] == true ? 'Aktif' : 'Non-Aktif',
              ];
            }),
            headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 8, color: PdfColors.white),
            headerDecoration: const pw.BoxDecoration(color: PdfColors.blue800),
            cellStyle: const pw.TextStyle(fontSize: 8),
            oddRowDecoration: const pw.BoxDecoration(color: PdfColors.grey100),
            border: pw.TableBorder.all(color: PdfColors.grey300),
            columnWidths: {
              0: const pw.FixedColumnWidth(25),
              1: const pw.FixedColumnWidth(140),
              2: const pw.FlexColumnWidth(2),
              3: const pw.FlexColumnWidth(2),
              4: const pw.FixedColumnWidth(65),
              5: const pw.FixedColumnWidth(65),
              6: const pw.FixedColumnWidth(65),
            },
          ),
        ],
      ),
    );

    final dir = await getApplicationDocumentsDirectory();
    final file = File('${dir.path}/daftar_op_${DateTime.now().millisecondsSinceEpoch}.pdf');
    await file.writeAsBytes(await pdf.save());
    return file;
  }

  // ─── Helper: share file via WhatsApp / platform share sheet ───
  static Future<void> shareFile(File file, {String? subject}) async {
    await Share.shareXFiles(
      [XFile(file.path)],
      subject: subject ?? 'Export SIPD Purbalingga',
    );
  }

  // ─── Helper: open file di viewer lokal ───
  static Future<void> openFile(File file) async {
    await OpenFile.open(file.path);
  }
}
