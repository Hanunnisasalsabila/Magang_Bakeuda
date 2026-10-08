import 'package:flutter/material.dart';

class BantuanDesaScreen extends StatelessWidget {
  const BantuanDesaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const Color kNavy = Color(0xFF0C2A5B);
    const Color kGold = Color(0xFFC9A227);

    final List<Map<String, dynamic>> faqs = [
      {
        'q': 'Bagaimana prosedur pembuatan pengajuan SPOP baru?',
        'a': [
          'Pengajuan SPOP (Surat Pemberitahuan Objek Pajak) baru dapat dilakukan dengan langkah berikut:',
          '1. Buka menu navigasi samping dan pilih "Pendaftaran SPOP Baru" > "SPOP Standar (Bumi & Bangunan)".',
          '2. Isi formulir SPOP dengan lengkap dan benar sesuai dengan data wajib pajak dan objek pajak.',
          '3. Pastikan untuk mengunggah dokumen pendukung seperti KTP, Sertifikat, atau Surat Keterangan lainnya.',
          '4. Jika data sudah benar, klik tombol "Ajukan" untuk mengirim berkas ke Bakeuda agar diproses.',
          '5. Anda juga bisa menekan tombol tambah (+) di bagian tengah bawah layar beranda untuk membuat pengajuan baru.'
        ],
      },
      {
        'q': 'Bagaimana menyimpan dan melanjutkan pengisian draf SPOP?',
        'a': [
          'Jika Anda belum selesai mengisi formulir pengajuan SPOP, Anda dapat menyimpannya sebagai draf:',
          '1. Saat mengisi form SPOP, klik tombol "Simpan Draf" di bagian bawah formulir.',
          '2. Untuk melanjutkan pengisian, buka menu "Draf Dokumen Tersimpan" dari menu navigasi.',
          '3. Pilih draf yang ingin dilanjutkan, lengkapi data yang kurang, lalu klik "Ajukan" jika sudah selesai.'
        ],
      },
      {
        'q': 'Bagaimana cara memantau status pengajuan SPOP yang telah dikirim?',
        'a': [
          'Anda dapat memantau status pengajuan yang telah dikirim ke Bakeuda dengan cara berikut:',
          '1. Buka menu "Status Pengajuan PBB-P2" (Pantau) dari menu bawah atau navigasi samping.',
          '2. Di halaman tersebut, Anda bisa melihat daftar pengajuan SPOP yang sedang diproses.',
          '3. Status pengajuan bisa berupa "Menunggu Verifikasi", "Disetujui", atau "Ditolak".'
        ],
      },
      {
        'q': 'Apa yang harus dilakukan jika pengajuan SPOP ditolak?',
        'a': [
          'Jika pengajuan Anda ditolak oleh pihak verifikator Bakeuda, ikuti langkah berikut:',
          '1. Periksa alasan penolakan pada detail riwayat pengajuan atau melalui notifikasi yang diterima.',
          '2. Catat bagian mana saja yang perlu diperbaiki (misalnya dokumen lampiran tidak jelas, atau data tidak sesuai).',
          '3. Buat pengajuan SPOP baru dengan mengisikan data yang sudah diperbaiki sesuai dengan catatan dari verifikator.'
        ],
      },
      {
        'q': 'Bagaimana mencari data dan arsip objek pajak?',
        'a': [
          'Untuk melihat arsip atau data objek pajak dan subjek pajak yang ada di wilayah Anda:',
          '1. Buka menu "Arsip Data Objek Pajak" untuk melihat daftar pengajuan yang sudah pernah dilakukan.',
          '2. Buka menu "Daftar Subjek Pajak" untuk melihat daftar wajib pajak yang terdata.',
          '3. Buka menu "Daftar Objek Pajak" untuk melihat rincian objek pajak (tanah/bangunan) di desa Anda.'
        ],
      },
      {
        'q': 'Bagaimana prosedur Login, Logout, dan mengubah profil akun?',
        'a': [
          'Prosedur untuk mengakses sistem, keluar, dan mengatur profil akun adalah sebagai berikut:',
          '1. Login: Buka halaman awal aplikasi, masukkan Username dan Kata Sandi, lalu klik tombol "Masuk".',
          '2. Profil: Buka menu "Profil Pengguna" dari menu bawah atau samping. Di sini Anda bisa melihat informasi akun dan mengubah password.',
          '3. Logout: Jangan lupa untuk selalu keluar dari sistem dengan aman melalui menu "Logout" (Keluar) di menu navigasi samping.'
        ],
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      appBar: AppBar(
        title: const Text('Bantuan & Panduan Desa'),
        backgroundColor: Colors.white,
        foregroundColor: kNavy,
        elevation: 0,
        shape: const Border(bottom: BorderSide(color: Colors.black12, width: 1)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        itemCount: faqs.length,
        itemBuilder: (context, index) {
          final item = faqs[index];
          final answers = item['a'] as List<String>;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Theme(
              data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
              child: ExpansionTile(
                iconColor: kGold,
                collapsedIconColor: Colors.grey.shade600,
                title: Text(
                  item['q'],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: kNavy,
                  ),
                ),
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: answers.map((text) {
                        final isListItem = text.startsWith(RegExp(r'^[0-9]\.'));
                        return Padding(
                          padding: EdgeInsets.only(
                            top: isListItem ? 6 : 0,
                            left: isListItem ? 12 : 0,
                            bottom: isListItem ? 0 : 8,
                          ),
                          child: Text(
                            text,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade700,
                              height: 1.5,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
