# Pembagian Tugas Tim Backend - Aplikasi PBB Bakeuda

Berdasarkan struktur database (ERD) yang telah dirancang, sistem ini memiliki kompleksitas tinggi pada alur kerja transaksi SPOP (Surat Pemberitahuan Objek Pajak). Untuk efisiensi kerja 2 orang Backend Developer, pembagian tugas dilakukan berdasarkan **Domain/Modul (Domain-Driven)**. 

Pendekatan ini dipilih untuk meminimalisir bentrok kode (merge conflict) dan membagi fokus antara pengelolaan "Data Master & Perhitungan" dengan "Alur Kerja (Workflow) & Berkas".

---

## 👤 Backend Developer 1: Fondasi, Master Data & Penagihan (Billing)

**Fokus Utama:** Membangun pondasi aplikasi, mengelola entitas master (data statis dan entitas utama), serta mengurus output akhir berupa tagihan pajak (SPPT).

### 1. Modul Autentikasi & Otorisasi (`USERS`)
*   **Fitur Login:** Autentikasi pengguna menggunakan JWT (JSON Web Token).
*   **Role-Based Access Control (RBAC):** Pembuatan middleware/guard untuk membedakan akses API antara role `DESA` dan `BAKEUDA`.
*   **Manajemen Pengguna:** CRUD data user (pembuatan akun desa oleh admin Bakeuda, dll).

### 2. Modul Master Data (`WILAYAH`)
*   **CRUD Data Wilayah:** Pengelolaan data Kabupaten, Kecamatan, dan Desa/Kelurahan.
*   **API Referensi:** Menyediakan endpoint untuk *dropdown* pilihan wilayah di frontend.

### 3. Modul Entitas Utama (`SUBJEK_PAJAK` & `OBJEK_PAJAK`)
*   **Manajemen Wajib Pajak (Subjek):** CRUD data Wajib Pajak (berdasarkan NIK).
*   **Manajemen Objek Pajak (Tanah/Bangunan):** CRUD data Objek Pajak.
*   **Generator NOP:** Pembuatan fungsi untuk meng-generate Nomor Objek Pajak (NOP) yang valid berdasarkan kode wilayah dan sequence.
*   **Pencarian & Filter:** API untuk mencari subjek/objek pajak berdasarkan NIK, NOP, Nama, atau alamat.

### 4. Modul Tagihan & Pembayaran (`SPPT`)
*   **Kalkulator Pajak:** Pembuatan service/helper untuk menghitung PBB Terutang secara otomatis berdasarkan Rumus (Luas x NJOP), NJOPTKP, dan Tarif PBB.
*   **Penerbitan Tagihan:** Fitur untuk men-generate (menerbitkan) SPPT secara massal di awal tahun pajak atau perorangan berdasarkan transaksi baru.
*   **Status Pembayaran:** API webhook/endpoint untuk mengupdate status pembayaran dari `BELUM_BAYAR` menjadi `LUNAS`.

---

## 👤 Backend Developer 2: Workflow Transaksi & Manajemen Berkas

**Fokus Utama:** Bertanggung jawab atas "mesin utama" aplikasi, yaitu alur birokrasi pengajuan SPOP dari tingkat Desa hingga diverifikasi oleh Bakeuda, termasuk manajemen berkas fisik digital.

### 1. Modul Transaksi SPOP (`TRANSAKSI_SPOP`)
*   **State Machine Transaksi:** Mengelola alur `status_ajuan` berdasarkan enum: `DRAFT` -> `MENUNGGU` (Diajukan Desa) -> `DISETUJUI` / `DITOLAK` / `REVISI` (Verifikasi Bakeuda).
*   **Routing Transaksi:** Menangani logika berdasarkan `jenis_transaksi` (`BARU`, `MUTASI`, `PECAH`, `GABUNG`, `PERUBAHAN_DATA`).
*   **Verifikasi Bakeuda:** API khusus untuk Bakeuda menyetujui transaksi (update `id_verifikator`, `verified_at`) atau mengembalikan status `REVISI` dengan `catatan_bakeuda`.

### 2. Modul Detail Transaksi (Asal & Tujuan)
*   **Penanganan Relasi One-to-Many:** Menangani pembuatan data array `detail_asal` (untuk NOP lama) dan `detail_tujuan` (untuk rancangan NOP baru). Hal ini penting untuk transaksi `PECAH` (1 Asal -> Banyak Tujuan) dan `GABUNG` (Banyak Asal -> 1 Tujuan).
*   **Logika Transaksi Spesifik:**
    *   *Pecah:* Validasi matematis agar total `luas_tanah_baru` di seluruh `detail_tujuan` tidak melebihi luas tanah `objek_asal`.
    *   *Mutasi/Perubahan Data:* Merubah `nik_calon_subjek` atau sekadar update data fisik bangunan.
*   **Eksekusi Finalisasi SPOP (Trigger `DISETUJUI`):** Membuat *Database Transaction* (ACID) dengan alur:
    1. Looping `detail_asal`: Jika `nonaktifkan_saat_disetujui` = true, nonaktifkan `OBJEK_PAJAK` lama berdasarkan `nop_asal`.
    2. Looping `detail_tujuan`: Memanggil service dari Developer 1 untuk insert `OBJEK_PAJAK` baru menggunakan data (`nik_calon_subjek`, `luas_tanah_baru`, dll), lalu simpan hasil NOP ke field `nop_generated`.

### 3. Modul Dokumen Lampiran (`LAMPIRAN_DOKUMEN`)
*   **File Upload Service:** API untuk mengunggah berkas lampiran (KTP, SHM, AJB, dll) ke Cloud Storage (misal: AWS S3, Minio) atau Local Storage.
*   **Validasi File:** Mengecek tipe file yang diizinkan (PDF, JPG, PNG) dan batas ukuran file maksimal.
*   **Relasi Dokumen:** Mengaitkan URL file yang terunggah dengan ID Transaksi yang sedang diajukan.

---

## 🤝 Panduan Kolaborasi (SOP Tim)

1.  **Prioritas Pengerjaan (Minggu Pertama):** 
    Developer 1 **wajib** menyelesaikan CRUD dasar untuk tabel `SUBJEK_PAJAK` dan `OBJEK_PAJAK` terlebih dahulu. Developer 2 sangat bergantung pada struktur data ini untuk mulai membangun tabel `DETAIL_TRANSAKSI_ASAL` dan `TUJUAN`.
2.  **Gunakan Database Transactions (ACID):**
    Terutama untuk Developer 2, pastikan semua operasi database pada saat *Approval SPOP* dibungkus dalam DB Transaction. Jika pembuatan Objek Pajak baru gagal, maka penonaktifan Objek Pajak lama harus di-rollback.
3.  **Standarisasi Response API:**
    Sepakati format response JSON standar (contoh: `{ "status": "success", "data": {...}, "message": "..." }`) agar Frontend mudah mengonsumsi data dari kedua developer.
