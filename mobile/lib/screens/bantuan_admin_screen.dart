import 'package:flutter/material.dart';

class BantuanAdminScreen extends StatelessWidget {
  const BantuanAdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const Color kNavy = Color(0xFF0C2A5B);
    const Color kGold = Color(0xFFC9A227);

    final List<Map<String, dynamic>> faqs = [
      {
        'q': 'Bagaimana prosedur verifikasi dan penolakan berkas pengajuan SPOP dari desa?',
        'a': [
          'Proses verifikasi dokumen SPOP memerlukan ketelitian. Berikut adalah tahapan untuk memproses antrean:',
          '1. Buka menu "Antrean Validasi" melalui menu navigasi samping (drawer).',
          '2. Cari dokumen SPOP yang berstatus "Menunggu Verifikasi" (berkas yang belum diproses oleh petugas lain).',
          '3. Klik tombol "Proses Validasi" pada dokumen tersebut agar berkas terkunci dan tidak bisa diproses oleh admin lain di saat yang bersamaan.',
          '4. Lakukan pemeriksaan data. Bandingkan "Data Lama" (jika ada) dengan "Data Baru" yang diajukan oleh desa.',
          '5. Periksa juga dokumen lampiran (seperti Sertifikat Tanah atau Bukti Kepemilikan) untuk memastikan kelengkapan syarat.',
          '6. Jika ada data atau lampiran yang salah, tuliskan alasan penolakan pada kolom catatan, lalu klik tombol "Tolak".',
          '7. Jika semua data sudah benar dan lengkap, klik tombol "Setujui" untuk menyelesaikan proses verifikasi.'
        ],
      },
      {
        'q': 'Bagaimana prosedur pencarian dan pengecekan daftar seluruh objek pajak?',
        'a': [
          'Menu Data Objek Pajak menampilkan seluruh data wajib pajak yang sudah terdaftar di sistem. Langkah-langkah pengecekannya adalah:',
          '1. Buka menu "Data Objek Pajak" pada menu navigasi samping.',
          '2. Gunakan kolom pencarian untuk mencari data spesifik berdasarkan Nomor Objek Pajak (NOP), nama wajib pajak, ataupun nama desa/kecamatan.',
          '3. Klik baris data yang diinginkan untuk melihat informasi detail mengenai objek pajak tersebut.',
          '4. Pada tampilan detail, tersedia informasi mengenai riwayat perubahan data dan riwayat pengajuan SPOP yang pernah diproses.',
          '5. Sebagai catatan, menu ini hanya bersifat untuk melihat data (Read-Only) guna menjaga keamanan basis data. Semua perubahan wajib melalui pengajuan SPOP.'
        ],
      },
      {
        'q': 'Bagaimana prosedur pelacakan riwayat keputusan dokumen SPOP?',
        'a': [
          'Setiap dokumen yang telah selesai diproses akan tercatat secara permanen di dalam sistem. Cara melihat riwayat tersebut adalah:',
          '1. Buka menu "Riwayat Persetujuan" melalui menu navigasi samping.',
          '2. Sistem akan menampilkan daftar seluruh pengajuan SPOP yang sudah selesai diproses (baik yang berstatus "Disetujui" maupun "Ditolak").',
          '3. Pada tabel atau kartu, perhatikan informasi "Verifikator" untuk mengetahui siapa admin Bakeuda yang memberikan keputusan atas dokumen tersebut.',
          '4. Riwayat penyelesaian ini disimpan secara aman oleh sistem dan tidak dapat diubah setelah keputusan dibuat.'
        ],
      },
      {
        'q': 'Bagaimana prosedur pengelolaan data wilayah (Kecamatan dan Desa)?',
        'a': [
          'Pengaturan data wilayah harus dipastikan sudah benar sebelum sistem digunakan oleh pihak desa. Tahapan pengelolaannya adalah:',
          '1. Buka menu "Manajemen Wilayah" dari menu navigasi samping.',
          '2. Untuk menambah daerah baru, klik tombol penambahan wilayah (Tambah Wilayah Baru), dan masukkan kode wilayah serta detail lainnya.',
          '3. Untuk memperbaiki kesalahan penulisan nama wilayah, gunakan pilihan "Edit" pada menu opsi di baris wilayah yang ingin diperbaiki.',
          '4. Jika ada desa yang dinonaktifkan atau digabung, cukup hapus atau sesuaikan wilayah tersebut.'
        ],
      },
      {
        'q': 'Bagaimana prosedur pengelolaan, pendaftaran, dan penghapusan akun pengguna?',
        'a': [
          'Admin Pusat memiliki kewenangan untuk mengatur akses login bagi pengguna sistem. Langkah pengelolaannya adalah:',
          '1. Buka menu "Manajemen Akun Desa" melalui navigasi samping.',
          '2. Untuk membuat akun perangkat desa atau admin baru, klik tombol Tambah Akun. Isikan nama lengkap, wilayah tugas, dan buat kata sandi awal untuk pengguna tersebut.',
          '3. Jika ada pengguna yang lupa kata sandinya, admin dapat mereset kata sandi melalui opsi "Edit" pada akun pengguna tersebut.',
          '4. Jika terdapat perangkat desa yang sudah tidak menjabat, admin wajib mencabut aksesnya dengan mengeklik opsi "Hapus".'
        ],
      },
      {
        'q': 'Bagaimana prosedur Login, Logout, dan mengubah profil akun?',
        'a': [
          'Prosedur untuk mengakses sistem, keluar, dan mengatur profil akun adalah sebagai berikut:',
          '1. Login: Buka halaman awal aplikasi, masukkan Username dan Kata Sandi, lalu klik tombol "Masuk".',
          '2. Ubah Profil: Buka menu "Profil Pengguna" dari menu navigasi samping. Anda dapat melengkapi informasi pendukung atau mengubah kata sandi.',
          '3. Logout: Jangan lupa untuk selalu keluar dari sistem dengan aman melalui menu "Log Out" (Keluar) di menu navigasi samping.'
        ],
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      appBar: AppBar(
        title: const Text('Bantuan & Panduan'),
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
