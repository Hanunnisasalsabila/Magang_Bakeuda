# Prisma Schema — Multi-File Models (Sesuai ERD)

Schema ini menggunakan **multi-file schema** Prisma dengan `prismaSchemaFolder`.  
Semua model disesuaikan **persis** dengan ERD yang diberikan.

---

## Struktur Folder

```
prisma/
├── schema.prisma
└── models/
    ├── user.prisma
    ├── wilayah.prisma
    ├── subjek_pajak.prisma
    ├── objek_pajak.prisma
    ├── transaksi.prisma
    ├── lampiran.prisma
    └── sppt.prisma
```

---

## 1. `prisma/schema.prisma`

Hanya berisi konfigurasi generator dan datasource.

```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "./generated"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 2. `prisma/models/user.prisma`

Model `User` lama kamu disesuaikan — field yang sudah ada **tidak diubah**,
hanya ditambahkan relasi dan field baru sesuai ERD.

```prisma
enum Role {
  DESA
  BAKEUDA
}

model User {
  id_user      String   @id @default(uuid())
  username     String   @unique @db.VarChar(50)
  password_hash String  @db.VarChar(255)
  nama_lengkap String   @db.VarChar(100)
  role         Role
  kode_wilayah String?  @db.VarChar(10)
  nip          String?  @db.VarChar(25)
  is_active    Boolean  @default(true)
  created_at   DateTime @default(now())

  // ── Relasi ──
  wilayah                Wilayah?          @relation(fields: [kode_wilayah], references: [kode_wilayah])
  subjek_pajak_dibuat    SubjekPajak[]     @relation("CreatedByUser")
  objek_nonaktif         ObjekPajak[]      @relation("NonaktifOlehUser")
  transaksi_diajukan     TransaksiSpop[]   @relation("PengajuUser")
  transaksi_diverifikasi TransaksiSpop[]   @relation("VerifikatorUser")
  lampiran_diupload      LampiranDokumen[] @relation("UploadedByUser")
  sppt_digenerate        Sppt[]            @relation("GeneratedByUser")

  @@map("users")
}
```

> **Catatan migrasi:** Field `id` → `id_user`, `password` → `password_hash`.
> Jika tabel `users` sudah ada, lihat bagian **Strategi Migrasi** di bawah.

---

## 3. `prisma/models/wilayah.prisma`

```prisma
model Wilayah {
  kode_wilayah String @id @db.VarChar(10)
  nama_desa    String @db.VarChar(100)
  kode_kel     String @db.VarChar(5)
  kecamatan    String @db.VarChar(100)
  kode_kec     String @db.VarChar(5)
  kabupaten    String @db.VarChar(100)
  kode_kab     String @db.VarChar(5)

  // ── Relasi ──
  users User[]

  @@map("wilayah")
}
```

---

## 4. `prisma/models/subjek_pajak.prisma`

```prisma
enum StatusWp {
  PEMILIK
  PENYEWA
  PENGGARAP
  PEMAKAI
}

enum Pekerjaan {
  PNS
  TNI_POLRI
  PEGAWAI_SWASTA
  WIRASWASTA
  PETANI
  NELAYAN
  PENSIUNAN
  LAINNYA
}

model SubjekPajak {
  nik                String     @id @db.VarChar(16)
  nama_subjek        String     @db.VarChar(100)
  status_wp          StatusWp
  pekerjaan          Pekerjaan
  npwp               String?    @db.VarChar(20)
  no_hp              String?    @db.VarChar(15)
  alamat_jalan       String     @db.VarChar(255)
  blok_kav_no_subjek String?    @db.VarChar(50)
  rw                 String?    @db.VarChar(5)
  rt                 String?    @db.VarChar(5)
  kelurahan          String     @db.VarChar(100)
  kabupaten          String     @db.VarChar(100)
  kode_pos           String?    @db.VarChar(5)
  created_at         DateTime   @default(now())
  updated_at         DateTime   @updatedAt
  created_by         String     // FK → users.id_user

  // ── Relasi ──
  user          User                    @relation("CreatedByUser", fields: [created_by], references: [id_user])
  objek_pajak   ObjekPajak[]
  detail_tujuan DetailTransaksiTujuan[]

  @@map("subjek_pajak")
}
```

---

## 5. `prisma/models/objek_pajak.prisma`

```prisma
enum JenisTanah {
  TANAH_BANGUNAN
  TANAH_PERTANIAN
  TANAH_PERKEBUNAN
  TANAH_KEHUTANAN
  TANAH_LAINNYA
}

model ObjekPajak {
  nop             String     @id @db.VarChar(18)
  nik_subjek      String     @db.VarChar(16)
  no_persil       String?    @db.VarChar(20)
  jalan_op        String     @db.VarChar(255)
  blok_kav_no     String?    @db.VarChar(50)
  rw_op           String?    @db.VarChar(5)
  rt_op           String?    @db.VarChar(5)
  kelurahan_op    String     @db.VarChar(100)
  kecamatan_op    String     @db.VarChar(100)
  luas_tanah      Decimal    @db.Decimal(10, 2)
  zona_nilai_tanah String?   @db.VarChar(10)
  jenis_tanah     JenisTanah
  jumlah_bangunan Int        @default(0)
  luas_bangunan   Decimal    @default(0) @db.Decimal(10, 2)
  njop_tanah      Decimal?   @db.Decimal(15, 2)
  njop_bangunan   Decimal?   @db.Decimal(15, 2)
  njop_total      Decimal?   @db.Decimal(15, 2)
  tahun_penilaian Int?       // YEAR disimpan sebagai Int di PostgreSQL
  status_aktif    Boolean    @default(true)
  nonaktif_oleh   String?    // FK → users.id_user
  nonaktif_at     DateTime?
  created_at      DateTime   @default(now())

  // ── Relasi ──
  subjek_pajak  SubjekPajak           @relation(fields: [nik_subjek], references: [nik])
  user_nonaktif User?                 @relation("NonaktifOlehUser", fields: [nonaktif_oleh], references: [id_user])
  transaksi     TransaksiSpop[]       @relation("ObjekBersama")
  detail_asal   DetailTransaksiAsal[]
  sppt          Sppt[]

  @@map("objek_pajak")
}
```

---

## 6. `prisma/models/transaksi.prisma`

```prisma
enum JenisTransaksi {
  BARU
  MUTASI
  PECAH
  GABUNG
  PERUBAHAN_DATA
}

enum StatusAjuan {
  DRAFT
  MENUNGGU
  DISETUJUI
  DITOLAK
  REVISI
}

// ── Transaksi SPOP ──

model TransaksiSpop {
  id_transaksi      String         @id @default(uuid())
  no_formulir       String?        @db.VarChar(20)
  id_user           String         // FK → users.id_user (pengaju DESA)
  tahun_pajak       Int            // YEAR disimpan sebagai Int
  jenis_transaksi   JenisTransaksi
  nop_bersama       String?        @db.VarChar(18)
  no_sppt_lama      String?        @db.VarChar(20)
  nama_pengaju      String?        @db.VarChar(100)
  menggunakan_kuasa Boolean        @default(false)
  tanggal_pengajuan DateTime       // DATE → DateTime di Prisma
  status_ajuan      StatusAjuan    @default(DRAFT)
  id_verifikator    String?        // FK → users.id_user (verifikator BAKEUDA)
  verified_at       DateTime?
  catatan_bakeuda   String?        // TEXT
  created_at        DateTime       @default(now())
  updated_at        DateTime       @updatedAt

  // ── Relasi ──
  pengaju       User                    @relation("PengajuUser", fields: [id_user], references: [id_user])
  verifikator   User?                   @relation("VerifikatorUser", fields: [id_verifikator], references: [id_user])
  objek_bersama ObjekPajak?             @relation("ObjekBersama", fields: [nop_bersama], references: [nop])
  detail_asal   DetailTransaksiAsal[]
  detail_tujuan DetailTransaksiTujuan[]
  lampiran      LampiranDokumen[]
  sppt          Sppt[]                  @relation("TransaksiAsalSppt")

  @@map("transaksi_spop")
}

// ── Detail Transaksi Asal ──

model DetailTransaksiAsal {
  id_detail_asal              String  @id @default(uuid())
  id_transaksi                String  // FK → transaksi_spop
  nop_asal                    String? @db.VarChar(18)
  nonaktifkan_saat_disetujui  Boolean @default(true)

  // ── Relasi ──
  transaksi  TransaksiSpop @relation(fields: [id_transaksi], references: [id_transaksi])
  objek_asal ObjekPajak?   @relation(fields: [nop_asal], references: [nop])

  @@map("detail_transaksi_asal")
}

// ── Detail Transaksi Tujuan ──

model DetailTransaksiTujuan {
  id_detail_tujuan     String     @id @default(uuid())
  id_transaksi         String     // FK → transaksi_spop
  nik_calon_subjek     String     @db.VarChar(16)
  luas_tanah_baru      Decimal    @db.Decimal(10, 2)
  luas_bangunan_baru   Decimal    @default(0) @db.Decimal(10, 2)
  jumlah_bangunan_baru Int        @default(0)
  jenis_tanah_baru     JenisTanah
  no_persil_baru       String?    @db.VarChar(20)
  nop_generated        String?    @db.VarChar(18)

  // ── Relasi ──
  transaksi    TransaksiSpop @relation(fields: [id_transaksi], references: [id_transaksi])
  calon_subjek SubjekPajak   @relation(fields: [nik_calon_subjek], references: [nik])

  @@map("detail_transaksi_tujuan")
}
```

---

## 7. `prisma/models/lampiran.prisma`

```prisma
enum JenisDokumen {
  KTP
  SHM
  AJB
  GIRIK
  SHGB
  IMB
  LAINNYA
}

model LampiranDokumen {
  id_dokumen         String       @id @default(uuid())
  id_transaksi       String       // FK → transaksi_spop
  jenis_dokumen      JenisDokumen
  keterangan_dokumen String?      @db.VarChar(255)
  url_file           String       @db.VarChar(500)
  uploaded_at        DateTime     @default(now())
  uploaded_by        String       // FK → users.id_user

  // ── Relasi ──
  transaksi TransaksiSpop @relation(fields: [id_transaksi], references: [id_transaksi])
  uploader  User          @relation("UploadedByUser", fields: [uploaded_by], references: [id_user])

  @@map("lampiran_dokumen")
}
```

---

## 8. `prisma/models/sppt.prisma`

```prisma
enum StatusBayar {
  BELUM_BAYAR
  LUNAS
  KEDALUWARSA
}

model Sppt {
  id_sppt           String      @id @default(uuid())
  nop               String      @db.VarChar(18)
  tahun_pajak       Int         // YEAR disimpan sebagai Int
  njop_kena_pajak   Decimal     @db.Decimal(15, 2)
  njoptkp           Decimal     @db.Decimal(15, 2)
  tarif_pbb         Decimal     @db.Decimal(5, 4)
  pbb_terutang      Decimal     @db.Decimal(15, 2)
  tgl_jatuh_tempo   DateTime    // DATE → DateTime
  status_bayar      StatusBayar @default(BELUM_BAYAR)
  tgl_bayar         DateTime?   // DATE → DateTime
  generated_by      String      // FK → users.id_user
  generated_at      DateTime    @default(now())
  id_transaksi_asal String?     // FK → transaksi_spop

  // ── Relasi ──
  objek_pajak    ObjekPajak     @relation(fields: [nop], references: [nop])
  generator      User           @relation("GeneratedByUser", fields: [generated_by], references: [id_user])
  transaksi_asal TransaksiSpop? @relation("TransaksiAsalSppt", fields: [id_transaksi_asal], references: [id_transaksi])

  @@map("sppt")
}
```

---

## 9. Perintah Jalankan

```bash
# 1. Validasi seluruh schema
npx prisma validate

# 2. Format otomatis
npx prisma format

# 3. Buat migrasi — hanya menambah tabel baru, tidak drop apapun
npx prisma migrate dev --name add_all_tables

# 4. Generate Prisma Client
npx prisma generate
```

---

## ⚠️ Strategi Migrasi — Tabel `users` Sudah Ada

Karena tabel `users` kamu sudah ada dengan nama field `id` dan `password`,
ada **dua pilihan**:

### Pilihan A — Sesuaikan nama field di schema (Recommended)

Tetap pakai nama field lama di schema Prisma menggunakan `@@map` dan `@map`,
agar database tidak perlu diubah:

```prisma
model User {
  id           String   @id @default(uuid()) @map("id")       // tetap kolom "id"
  username     String   @unique @db.VarChar(50)
  password     String   @db.VarChar(255)                      // tetap kolom "password"
  nama_lengkap String   @db.VarChar(100)
  role         Role
  kode_wilayah String?  @db.VarChar(10)
  nip          String?  @db.VarChar(25)
  is_active    Boolean  @default(true)
  created_at   DateTime @default(now())

  // relasi pakai field "id" bukan "id_user"
  wilayah                Wilayah?          @relation(fields: [kode_wilayah], references: [kode_wilayah])
  subjek_pajak_dibuat    SubjekPajak[]     @relation("CreatedByUser")
  objek_nonaktif         ObjekPajak[]      @relation("NonaktifOlehUser")
  transaksi_diajukan     TransaksiSpop[]   @relation("PengajuUser")
  transaksi_diverifikasi TransaksiSpop[]   @relation("VerifikatorUser")
  lampiran_diupload      LampiranDokumen[] @relation("UploadedByUser")
  sppt_digenerate        Sppt[]            @relation("GeneratedByUser")

  @@map("users")
}
```

Lalu di semua model lain, ganti referensi `references: [id_user]` → `references: [id]`.

> Dengan Pilihan A: **tidak ada kolom yang berubah**, tidak ada data yang hilang.
> Migrasi hanya akan menambah tabel baru dan FK constraint.

### Pilihan B — Reset database (jika data belum penting)

```bash
# ⚠️  HAPUS SEMUA DATA dan buat ulang dari awal
npx prisma migrate reset
```

Gunakan ini hanya jika database masih kosong atau data seed tidak masalah dihapus.

---

## Ringkasan Perubahan dari ERD

| Field ERD | Tipe ERD | Tipe Prisma | Alasan |
|-----------|----------|-------------|--------|
| `YEAR` | YEAR | `Int` | PostgreSQL tidak punya tipe YEAR native |
| `DATE` | DATE | `DateTime` | Prisma memetakan DATE ke DateTime |
| `TEXT` | TEXT | `String` (tanpa @db.VarChar) | Default String di Prisma = TEXT di PostgreSQL |
| `UUID` PK | UUID | `String @default(uuid())` | Prisma generate UUID via `uuid()` |
| `BOOLEAN` | BOOLEAN | `Boolean` | Langsung kompatibel |
| `DECIMAL(x,y)` | DECIMAL | `Decimal @db.Decimal(x,y)` | Harus eksplisit agar presisi terjaga |
