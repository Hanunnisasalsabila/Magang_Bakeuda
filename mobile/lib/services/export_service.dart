import 'dart:io';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:share_plus/share_plus.dart';
import 'package:open_file/open_file.dart';
import 'package:excel/excel.dart' as xl;

// Palet warna resmi instansi (samakan dengan tema di aplikasi Flutter)
final PdfColor _kNavy = PdfColor.fromHex('#0C2A5B');
final PdfColor _kGold = PdfColor.fromHex('#C9A227');

class ExportService {
  /// Kop surat resmi dipakai di semua dokumen PDF kredensial supaya
  /// tampilannya konsisten: nama instansi tebal, subjudul, logo di kanan,
  /// garis pembatas navy di bawahnya.
  static Future<pw.ImageProvider?> _loadLogo() async {
    try {
      final logoBytes = await rootBundle.load('assets/logo-purbalingga.png');
      return pw.MemoryImage(logoBytes.buffer.asUint8List());
    } catch (_) {
      return null;
    }
  }

  static pw.Widget _buildKopSurat({
    required pw.ImageProvider? logoImage,
    double titleSize = 13,
    double subtitleSize = 11,
    double logoSize = 46,
  }) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Row(
          crossAxisAlignment: pw.CrossAxisAlignment.center,
          children: [
            if (logoImage != null)
              pw.SizedBox(
                width: logoSize + 14,
                child: pw.Align(
                  alignment: pw.Alignment.centerLeft,
                  child: pw.Image(logoImage, width: logoSize, height: logoSize),
                ),
              ),
            pw.Expanded(
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.center,
                children: [
                  pw.Text(
                    'PEMERINTAH KABUPATEN PURBALINGGA',
                    style: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      fontSize: titleSize,
                      color: _kNavy,
                    ),
                    textAlign: pw.TextAlign.center,
                  ),
                  pw.SizedBox(height: 2),
                  pw.Text(
                    'BADAN KEUANGAN DAERAH (BAKEUDA)',
                    style: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      fontSize: subtitleSize + 1,
                      color: PdfColors.black,
                    ),
                    textAlign: pw.TextAlign.center,
                  ),
                  pw.SizedBox(height: 2),
                  pw.Text(
                    'Jl. Onje No.1B, Purbalingga Lor, Kec. Purbalingga, Kabupaten Purbalingga, Jawa Tengah 53311',
                    style: pw.TextStyle(
                      fontSize: subtitleSize - 2,
                      color: PdfColors.black,
                    ),
                    textAlign: pw.TextAlign.center,
                  ),
                ],
              ),
            ),
            if (logoImage != null)
              pw.SizedBox(width: logoSize + 14), // Balances the logo on the left to perfectly center the text
          ],
        ),
        pw.SizedBox(height: 6),
        pw.Container(height: 2.5, color: _kNavy),
        pw.SizedBox(height: 2),
        pw.Container(height: 0.75, color: _kGold),
      ],
    );
  }

  // ─── Cetak Kredensial Akun Desa ke PDF (satu akun) ───
  static Future<File> cetakKredensialPdf({
    required String namaDesa,
    required String kecamatan,
    required String username,
    required String passwordAwal,
  }) async {
    final pdf = pw.Document();
    final logoImage = await _loadLogo();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a5,
        margin: const pw.EdgeInsets.all(28),
        build: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            _buildKopSurat(
              logoImage: logoImage,
              titleSize: 10,
              subtitleSize: 8.5,
              logoSize: 36,
            ),
            pw.SizedBox(height: 14),
            pw.Center(
              child: pw.Text(
                'KARTU KREDENSIAL AKUN DESA',
                style: pw.TextStyle(
                  fontWeight: pw.FontWeight.bold,
                  fontSize: 14,
                  color: _kNavy,
                ),
              ),
            ),
            pw.SizedBox(height: 4),
            pw.Center(
              child: pw.Text(
                'Sistem Informasi Pajak Daerah - BAKEUDA Purbalingga',
                style: const pw.TextStyle(
                  fontSize: 9,
                  color: PdfColors.grey600,
                ),
              ),
            ),
            pw.SizedBox(height: 20),
            // Info box
            pw.Container(
              padding: const pw.EdgeInsets.all(16),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: _kNavy, width: 1),
                borderRadius: pw.BorderRadius.circular(6),
                color: PdfColors.grey50,
              ),
              child: pw.Column(
                children: [
                  _buildKredensialRow('Nama Desa', namaDesa),
                  _buildKredensialRow('Kecamatan', kecamatan),
                  pw.Divider(color: PdfColors.grey300),
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
                  pw.Text(
                    'PENTING:',
                    style: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      fontSize: 10,
                      color: PdfColors.amber900,
                    ),
                  ),
                  pw.SizedBox(height: 4),
                  pw.Text(
                    '- Segera ganti password setelah login pertama kali.',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                  pw.Text(
                    '- Jangan berikan kredensial ini kepada pihak yang tidak berwenang.',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                  pw.Text(
                    '- Simpan kartu ini di tempat yang aman.',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                ],
              ),
            ),
            pw.Spacer(),
            pw.Divider(color: PdfColors.grey400),
            pw.Center(
              child: pw.Text(
                'Dicetak pada: ${DateFormat('dd MMMM yyyy, HH:mm', 'id').format(DateTime.now())}',
                style: const pw.TextStyle(
                  fontSize: 8,
                  color: PdfColors.grey600,
                ),
              ),
            ),
          ],
        ),
      ),
    );

    final dir = await getApplicationDocumentsDirectory();
    final file = File(
      '${dir.path}/kredensial_${username}_${DateTime.now().millisecondsSinceEpoch}.pdf',
    );
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
            child: pw.Text(
              label,
              style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
            ),
          ),
          pw.Text(': ', style: const pw.TextStyle(fontSize: 10)),
          pw.Expanded(
            child: pw.Text(
              value,
              style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Cetak Berita Acara Kredensial Kecamatan ke PDF (rekap semua desa) ───
  static Future<File> cetakKredensialKecamatanPdf({
    required String kecamatan,
    required String namaKepalaBkd,
    required String nipKepalaBkd,
    required String namaCamat,
    required String nipCamat,
    required List<Map<String, dynamic>> daftarDesa,
    required String passwordAwal,
  }) async {
    final pdf = pw.Document();
    final logoImage = await _loadLogo();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        build: (context) => [
          _buildKopSurat(logoImage: logoImage),
          pw.SizedBox(height: 20),

          // Title
          pw.Center(
            child: pw.Text(
              'SURAT SERAH TERIMA KREDENSIAL AKUN DESA',
              style: pw.TextStyle(
                fontWeight: pw.FontWeight.bold,
                fontSize: 14,
                decoration: pw.TextDecoration.underline,
                color: _kNavy,
              ),
            ),
          ),
          pw.SizedBox(height: 6),
          pw.Center(
            child: pw.Text(
              'Akun SIPD Purbalingga - Kecamatan $kecamatan',
              style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey600),
            ),
          ),
          pw.SizedBox(height: 24),

          pw.Text(
            'Pada hari ini ${DateFormat('EEEE, dd MMMM yyyy', 'id').format(DateTime.now())}, telah diserahkan kredensial akun akses Sistem Pajak Bumi Bangunan (SIPD Purbalingga) untuk perangkat desa di wilayah Kecamatan $kecamatan dengan rincian sebagai berikut:',
            style: const pw.TextStyle(fontSize: 10),
          ),
          pw.SizedBox(height: 16),

          // Table
          pw.TableHelper.fromTextArray(
            border: pw.TableBorder.all(color: PdfColors.grey400),
            cellAlignment: pw.Alignment.centerLeft,
            headerDecoration: pw.BoxDecoration(color: _kNavy),
            headerStyle: pw.TextStyle(
              fontWeight: pw.FontWeight.bold,
              fontSize: 9,
              color: PdfColors.white,
            ),
            cellStyle: const pw.TextStyle(fontSize: 9),
            headerHeight: 25,
            cellHeight: 26,
            oddRowDecoration: const pw.BoxDecoration(color: PdfColors.grey100),
            columnWidths: {
              0: const pw.FixedColumnWidth(30), // No
              1: const pw.FlexColumnWidth(2), // Desa
              2: const pw.FlexColumnWidth(2), // Username
              3: const pw.FlexColumnWidth(2), // Password
              4: const pw.FlexColumnWidth(1), // Paraf
            },
            headers: [
              'No',
              'Desa/Kelurahan',
              'Username',
              'Password Sementara',
              'Paraf',
            ],
            data: List<List<String>>.generate(
              daftarDesa.length,
              (index) => [
                '${index + 1}',
                daftarDesa[index]['nama_desa']?.toString() ?? '-',
                daftarDesa[index]['username']?.toString() ?? '-',
                passwordAwal,
                '', // Kosong untuk diparaf manual
              ],
            ),
          ),
          pw.SizedBox(height: 24),

          pw.Text(
            'Kredensial ini bersifat rahasia. Perangkat desa diwajibkan untuk segera mengganti kata sandi setelah melakukan login pertama kali.',
            style: const pw.TextStyle(fontSize: 10),
          ),
          pw.SizedBox(height: 40),

          // Signatures
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.center,
                children: [
                  pw.Text(
                    'Yang Menyerahkan,',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                  pw.Text(
                    'Kepala Bakeuda Purbalingga',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                  pw.SizedBox(height: 60),
                  pw.Text(
                    namaKepalaBkd,
                    style: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      fontSize: 10,
                      decoration: pw.TextDecoration.underline,
                    ),
                  ),
                  pw.Text(
                    'NIP. $nipKepalaBkd',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                ],
              ),
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.center,
                children: [
                  pw.Text(
                    'Yang Menerima,',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                  pw.Text(
                    'Camat $kecamatan',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                  pw.SizedBox(height: 60),
                  pw.Text(
                    namaCamat.isEmpty ? '.....................' : namaCamat,
                    style: pw.TextStyle(
                      fontWeight: pw.FontWeight.bold,
                      fontSize: 10,
                      decoration: pw.TextDecoration.underline,
                    ),
                  ),
                  pw.Text(
                    'NIP. ${nipCamat.isEmpty ? '.....................' : nipCamat}',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );

    final dir = await getApplicationDocumentsDirectory();
    final file = File(
      '${dir.path}/BA_Kredensial_Kecamatan_${kecamatan}_${DateTime.now().millisecondsSinceEpoch}.pdf',
    );
    await file.writeAsBytes(await pdf.save());
    return file;
  }

  // ─── Export Daftar Objek Pajak ke Excel ───
  static Future<File> exportObjekPajakExcel(
    List<Map<String, dynamic>> data,
  ) async {
    final excel = xl.Excel.createExcel();
    final sheet = excel['Daftar Objek Pajak'];
    excel.setDefaultSheet('Daftar Objek Pajak');

    // Header row
    final headers = [
      'NOP',
      'Nama WP',
      'Alamat OP',
      'Luas Tanah',
      'Luas Bgn',
      'Status',
      'Tgl Update',
    ];
    for (var i = 0; i < headers.length; i++) {
      final cell = sheet.cell(
        xl.CellIndex.indexByColumnRow(columnIndex: i, rowIndex: 0),
      );
      cell.value = xl.TextCellValue(headers[i]);
      cell.cellStyle = xl.CellStyle(
        bold: true,
        backgroundColorHex: xl.ExcelColor.fromHexString('#0C2A5B'),
        fontColorHex: xl.ExcelColor.fromHexString('#FFFFFF'),
      );
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
            .cell(
              xl.CellIndex.indexByColumnRow(columnIndex: j, rowIndex: i + 1),
            )
            .value = xl.TextCellValue(
          rowData[j],
        );
      }
    }

    final dir = await getApplicationDocumentsDirectory();
    final file = File(
      '${dir.path}/daftar_op_${DateTime.now().millisecondsSinceEpoch}.xlsx',
    );
    final bytes = excel.save();
    if (bytes != null) await file.writeAsBytes(bytes);
    return file;
  }

  // ─── Export Daftar Objek Pajak ke PDF ───
  static Future<File> exportObjekPajakPdf(
    List<Map<String, dynamic>> data,
  ) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4.landscape,
        header: (context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              'Daftar Objek Pajak Bumi dan Bangunan',
              style: pw.TextStyle(
                fontWeight: pw.FontWeight.bold,
                fontSize: 14,
                color: _kNavy,
              ),
            ),
            pw.Text(
              'Bakeuda Kab. Purbalingga | ${DateFormat('dd MMMM yyyy', 'id').format(DateTime.now())}',
              style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600),
            ),
            pw.Divider(color: _kNavy),
          ],
        ),
        build: (context) => [
          pw.TableHelper.fromTextArray(
            headers: [
              'No',
              'NOP',
              'Nama WP',
              'Alamat OP',
              'Luas Tanah',
              'Luas Bgn',
              'Status',
            ],
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
            headerStyle: pw.TextStyle(
              fontWeight: pw.FontWeight.bold,
              fontSize: 8,
              color: PdfColors.white,
            ),
            headerDecoration: pw.BoxDecoration(color: _kNavy),
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
    final file = File(
      '${dir.path}/daftar_op_${DateTime.now().millisecondsSinceEpoch}.pdf',
    );
    await file.writeAsBytes(await pdf.save());
    return file;
  }

  // ─── Helper: share file via WhatsApp / platform share sheet ───
  static Future<void> shareFile(File file, {String? subject}) async {
    await Share.shareXFiles([
      XFile(file.path),
    ], subject: subject ?? 'Export SIPD Purbalingga');
  }

  // ─── Helper: open file di viewer lokal ───
  static Future<void> openFile(File file) async {
    await OpenFile.open(file.path);
  }
}
