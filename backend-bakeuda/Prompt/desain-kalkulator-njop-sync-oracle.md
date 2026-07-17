# Desain Kalkulator NJOP Bangunan (DBKB) & Perluasan Sinkronisasi Oracle Lokal

Dokumen ini berisi 2 bagian yang saling terkait:
1. **Struktur perhitungan NJOP Bangunan** — memasukkan kualitas konstruksi & fasilitas, dengan nilai placeholder yang tinggal diisi begitu data resmi dari Bakeuda tersedia
2. **Perluasan sinkronisasi Oracle** — dari yang tadinya cuma ZNT, ditambah cakupan tabel DBKB (Daftar Biaya Komponen Bangunan), disesuaikan untuk koneksi Oracle yang jalan **lokal**

Lanjutan dari: `perbaikan-enum-klasifikasi-bangunan.md`, dan rencana `sinkronisasi-znt-oracle.md` yang sudah ada sebelumnya.

---

## BAGIAN 1 — Kalkulator NJOP Bangunan

### 1.1 Prinsip Desain

**Struktur perhitungan dan nilai aslinya dipisah total.** Semua tabel referensi di bawah dibuat dengan `nilai_per_m2` / `nilai_tambah` default `0` — sistem tetap bisa dijalankan, ditest, dan didemokan sekarang, tanpa perlu menunggu data resmi dari Bakeuda. Begitu data asli didapat, tinggal `UPDATE` tabel referensi, kode kalkulator **tidak perlu diubah sama sekali**.

### 1.2 Model Baru — `ReferensiDbkb` (Nilai per Kategori Klasifikasi)

Tambahkan ke `prisma/models/referensi_dbkb.prisma`:

```prisma
enum KategoriDbkb {
  KONDISI_BANGUNAN
  JENIS_KONSTRUKSI
  JENIS_ATAP
  JENIS_DINDING
  JENIS_LANTAI
  JENIS_LANGIT_LANGIT
  JENIS_PENGGUNAAN_BANGUNAN // basis nilai dasar per JPB, sebelum faktor kualitas
}

model ReferensiDbkb {
  id_dbkb        String       @id @default(uuid())
  kategori       KategoriDbkb
  kode           String       @db.VarChar(50) // value enum terkait, misal "BAIK", "BETON", dst — atau kode_jpb untuk kategori JPB
  nilai_per_m2   Decimal      @default(0) @db.Decimal(15, 2)
  tahun_berlaku  Int
  sumber_data    String       @default("MANUAL") // "MANUAL" atau "ORACLE_SYNC"
  synced_at      DateTime?
  created_at     DateTime     @default(now())
  updated_at     DateTime     @updatedAt

  @@unique([kategori, kode, tahun_berlaku])
  @@map("referensi_dbkb")
}
```

> Kenapa 1 tabel untuk semua kategori (bukan 7 tabel terpisah)? Karena strukturnya identik (kategori + kode + nilai), dan supaya sinkronisasi dari Oracle nanti bisa 1 alur ETL saja untuk semua kategori DBKB, bukan 7 alur terpisah.

### 1.3 Model Baru — `ReferensiNilaiFasilitas` (Nilai Tambah per Fasilitas)

```prisma
enum JenisFasilitas {
  AC_SPLIT
  AC_WINDOW
  AC_SENTRAL
  KOLAM_RENANG_PER_M2
  PERKERASAN_RINGAN_PER_M2
  PERKERASAN_SEDANG_PER_M2
  PERKERASAN_BERAT_PER_M2
  LAPANGAN_TENIS_BETON
  LAPANGAN_TENIS_ASPAL
  LAPANGAN_TENIS_TANAH_RUMPUT
  LIFT_PENUMPANG
  LIFT_KAPSUL
  LIFT_BARANG
  TANGGA_BERJALAN
  PAGAR_PER_M
  HYDRANT
  SPRINKLER
  FIRE_ALARM
  SALURAN_PABX
  SUMUR_ARTESIS_PER_M
}

model ReferensiNilaiFasilitas {
  id_nilai_fasilitas String         @id @default(uuid())
  jenis_fasilitas    JenisFasilitas
  nilai_tambah       Decimal        @default(0) @db.Decimal(15, 2) // per unit ATAU per m2, tergantung jenisnya
  tahun_berlaku      Int
  sumber_data        String         @default("MANUAL")
  synced_at          DateTime?
  created_at         DateTime       @default(now())
  updated_at         DateTime       @updatedAt

  @@unique([jenis_fasilitas, tahun_berlaku])
  @@map("referensi_nilai_fasilitas")
}
```

### 1.4 Seed Awal — Nilai Placeholder (Semua `0`)

`src/scripts/seed-referensi-dbkb-placeholder.ts`:

```typescript
const tahunBerlaku = new Date().getFullYear();

const dbkbPlaceholder = [
  // KONDISI_BANGUNAN
  { kategori: 'KONDISI_BANGUNAN', kode: 'SANGAT_BAIK', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'BAIK', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'SEDANG', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'JELEK', nilai_per_m2: 0 },
  // JENIS_KONSTRUKSI
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BAJA', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BETON', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BATU_BATA', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'KAYU', nilai_per_m2: 0 },
  // ...ulangi pola sama untuk JENIS_ATAP, JENIS_DINDING, JENIS_LANTAI, JENIS_LANGIT_LANGIT
  // ...dan JENIS_PENGGUNAAN_BANGUNAN (16 kode_jpb dari referensi JPB yang sudah ada)
];

for (const item of dbkbPlaceholder) {
  await prisma.referensiDbkb.upsert({
    where: { kategori_kode_tahun_berlaku: { kategori: item.kategori as any, kode: item.kode, tahun_berlaku: tahunBerlaku } },
    create: { ...item, tahun_berlaku: tahunBerlaku, sumber_data: 'MANUAL' } as any,
    update: {},
  });
}

const fasilitasPlaceholder = [
  { jenis_fasilitas: 'AC_SPLIT', nilai_tambah: 0 },
  { jenis_fasilitas: 'AC_WINDOW', nilai_tambah: 0 },
  { jenis_fasilitas: 'AC_SENTRAL', nilai_tambah: 0 },
  { jenis_fasilitas: 'KOLAM_RENANG_PER_M2', nilai_tambah: 0 },
  // ...ulangi untuk semua JenisFasilitas
];

for (const item of fasilitasPlaceholder) {
  await prisma.referensiNilaiFasilitas.upsert({
    where: { jenis_fasilitas_tahun_berlaku: { jenis_fasilitas: item.jenis_fasilitas as any, tahun_berlaku: tahunBerlaku } },
    create: { ...item, tahun_berlaku: tahunBerlaku, sumber_data: 'MANUAL' } as any,
    update: {},
  });
}
```

> Jalankan sekali di awal — tujuannya cuma supaya baris-baris referensi ada dan siap diisi, bukan untuk data final.

### 1.5 Formula Perhitungan — Revisi `pbb-calculator.ts`

```typescript
export class PbbCalculatorService {
  constructor(private readonly prisma: PrismaService) {}

  /** Ambil nilai DBKB untuk 1 kategori+kode, tahun berjalan */
  private async getNilaiDbkb(kategori: KategoriDbkb, kode: string | null, tahun: number): Promise<number> {
    if (!kode) return 0;
    const row = await this.prisma.referensiDbkb.findUnique({
      where: { kategori_kode_tahun_berlaku: { kategori, kode, tahun_berlaku: tahun } },
    });
    return row ? Number(row.nilai_per_m2) : 0;
  }

  /** Ambil nilai tambah fasilitas untuk 1 jenis, tahun berjalan */
  private async getNilaiFasilitas(jenis: JenisFasilitas, tahun: number): Promise<number> {
    const row = await this.prisma.referensiNilaiFasilitas.findUnique({
      where: { jenis_fasilitas_tahun_berlaku: { jenis_fasilitas: jenis, tahun_berlaku: tahun } },
    });
    return row ? Number(row.nilai_tambah) : 0;
  }

  /** Faktor penyusutan sederhana berdasarkan umur bangunan */
  private hitungFaktorPenyusutan(tahunDibangun: number | null, tahunRenovasi: number | null, tahunPenilaian: number): number {
    if (!tahunDibangun) return 1; // tidak ada data, anggap tidak susut (placeholder aman)
    const tahunDasar = tahunRenovasi ?? tahunDibangun;
    const umur = Math.max(0, tahunPenilaian - tahunDasar);
    // Formula umum: susut 1% per tahun, maksimal susut 60% (sisa nilai minimal 40%)
    // INI JUGA PLACEHOLDER — ganti sesuai Perda/Permendagri penyusutan NJOP yang berlaku di Purbalingga
    const susut = Math.min(umur * 0.01, 0.6);
    return 1 - susut;
  }

  async hitungNjopBangunan(idBangunan: string, tahunPenilaian: number): Promise<number> {
    const bangunan = await this.prisma.objekBangunan.findUnique({
      where: { id_bangunan: idBangunan },
      include: { fasilitas: true },
    });
    if (!bangunan) throw new NotFoundException('Data bangunan tidak ditemukan');

    // 1. Nilai dasar dari basis JPB (kelas penggunaan bangunan)
    const nilaiDasarJpb = await this.getNilaiDbkb('JENIS_PENGGUNAAN_BANGUNAN', bangunan.kode_jpb, tahunPenilaian);

    // 2. Nilai tambahan dari kualitas konstruksi (dijumlah, bukan dikali — sesuai pola DBKB standar)
    const nilaiKondisi = await this.getNilaiDbkb('KONDISI_BANGUNAN', bangunan.kondisi_bangunan, tahunPenilaian);
    const nilaiKonstruksi = await this.getNilaiDbkb('JENIS_KONSTRUKSI', bangunan.jenis_konstruksi, tahunPenilaian);
    const nilaiAtap = await this.getNilaiDbkb('JENIS_ATAP', bangunan.jenis_atap, tahunPenilaian);
    const nilaiDinding = await this.getNilaiDbkb('JENIS_DINDING', bangunan.kode_dinding, tahunPenilaian);
    const nilaiLantai = await this.getNilaiDbkb('JENIS_LANTAI', bangunan.kode_lantai, tahunPenilaian);
    const nilaiLangitLangit = await this.getNilaiDbkb('JENIS_LANGIT_LANGIT', bangunan.kode_langit_langit, tahunPenilaian);

    const nilaiPerM2Sebelumsusut =
      nilaiDasarJpb + nilaiKondisi + nilaiKonstruksi + nilaiAtap + nilaiDinding + nilaiLantai + nilaiLangitLangit;

    // 3. Faktor penyusutan berdasarkan umur bangunan
    const faktorSusut = this.hitungFaktorPenyusutan(bangunan.tahun_dibangun, bangunan.tahun_renovasi, tahunPenilaian);
    const nilaiPerM2SetelahSusut = nilaiPerM2Sebelumsusut * faktorSusut;

    // 4. Total dari luas × nilai per m2
    let total = Number(bangunan.luas_bangunan) * nilaiPerM2SetelahSusut;

    // 5. Tambahkan nilai fasilitas (kalau ada)
    if (bangunan.fasilitas) {
      const f = bangunan.fasilitas;
      total += Number(f.jumlah_ac_split) * (await this.getNilaiFasilitas('AC_SPLIT', tahunPenilaian));
      total += Number(f.jumlah_ac_window) * (await this.getNilaiFasilitas('AC_WINDOW', tahunPenilaian));
      if (f.ac_sentral) total += await this.getNilaiFasilitas('AC_SENTRAL', tahunPenilaian);
      total += Number(f.luas_kolam_renang) * (await this.getNilaiFasilitas('KOLAM_RENANG_PER_M2', tahunPenilaian));
      total += Number(f.lift_penumpang) * (await this.getNilaiFasilitas('LIFT_PENUMPANG', tahunPenilaian));
      total += Number(f.lift_kapsul) * (await this.getNilaiFasilitas('LIFT_KAPSUL', tahunPenilaian));
      total += Number(f.lift_barang) * (await this.getNilaiFasilitas('LIFT_BARANG', tahunPenilaian));
      total += Number(f.panjang_pagar_m) * (await this.getNilaiFasilitas('PAGAR_PER_M', tahunPenilaian));
      if (f.hydrant_ada) total += await this.getNilaiFasilitas('HYDRANT', tahunPenilaian);
      if (f.sprinkler_ada) total += await this.getNilaiFasilitas('SPRINKLER', tahunPenilaian);
      if (f.fire_alarm_ada) total += await this.getNilaiFasilitas('FIRE_ALARM', tahunPenilaian);
      total += Number(f.jumlah_saluran_pabx) * (await this.getNilaiFasilitas('SALURAN_PABX', tahunPenilaian));
      total += Number(f.kedalaman_sumur_artesis_m) * (await this.getNilaiFasilitas('SUMUR_ARTESIS_PER_M', tahunPenilaian));
      // tambahkan sisanya (perkerasan, lapangan tenis, tangga berjalan) dengan pola sama
    }

    return Math.round(total);
  }
}
```

> ⚠️ **Formula penyusutan dan cara akumulasi nilai (dijumlah vs dikali) di atas masih ASUMSI UMUM**, dibuat supaya kode bisa jalan dan ditest sekarang. Begitu Bakeuda kasih dokumen resmi cara perhitungan DBKB Purbalingga, kemungkinan **rumus di section 1.5 perlu disesuaikan** (misal ternyata pakai sistem skor/koefisien, bukan penjumlahan Rupiah langsung). Struktur tabel referensi di section 1.2-1.3 kemungkinan besar tetap terpakai, tapi cara meraciknya di kalkulator bisa berubah.

### 1.6 Integrasi ke `ObjekPajakService.update()`

Tambahkan opsi hitung otomatis, tapi tetap izinkan override manual oleh BAKEUDA (untuk kasus butuh koreksi manual):

```typescript
async hitungUlangNjopBangunan(idBangunan: string) {
  const tahunIni = new Date().getFullYear();
  const nilai = await this.pbbCalculator.hitungNjopBangunan(idBangunan, tahunIni);

  const bangunan = await this.prisma.objekBangunan.update({
    where: { id_bangunan: idBangunan },
    data: { nilai_sistem_bangunan: nilai },
  });

  // Sinkronkan ke agregat njop_bangunan di header ObjekPajak (jumlah semua bangunan dalam 1 NOP)
  const semuaBangunan = await this.prisma.objekBangunan.findMany({ where: { nop: bangunan.nop } });
  const totalNjopBangunan = semuaBangunan.reduce((sum, b) => sum + Number(b.nilai_sistem_bangunan ?? 0), 0);
  await this.prisma.objekPajak.update({ where: { nop: bangunan.nop }, data: { njop_bangunan: totalNjopBangunan } });

  return { success: true, data: bangunan };
}
```

Endpoint baru: `POST /objek-pajak/bangunan/:idBangunan/hitung-njop` (role BAKEUDA).

---

## BAGIAN 2 — Perluasan Sinkronisasi Oracle Lokal (ZNT + DBKB)

### 2.1 Perbedaan Karena Oracle Jalan Lokal

| Aspek | Rencana Awal (server terpisah) | Sekarang (lokal) |
|---|---|---|
| Izin akses jaringan ke server Bakeuda | Perlu dikonfirmasi/approval | **Tidak relevan** — sama-sama di mesin kamu |
| Firewall / VPN | Kemungkinan perlu | Tidak perlu |
| Connection string | IP/hostname server Bakeuda | `localhost` |
| Keamanan kredensial | Perlu disimpan hati-hati (server produksi orang lain) | Tetap perlu hati-hati, tapi risiko lebih rendah (lokal) |

### 2.2 Setup Environment

Pastikan sudah terinstall di komputer kamu:
1. **Oracle Database** (XE atau versi yang dipakai Bakeuda) — sudah "running di lokal" sesuai yang kamu sebutkan
2. **Oracle Instant Client** — wajib untuk `node-oracledb` bisa connect (native binding, bukan pure JS)
3. Paket npm: `npm install oracledb --save`

### 2.3 `.env` Tambahan

```env
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_SERVICE=XE
ORACLE_USER=readonly_user
ORACLE_PASSWORD=ganti_ini
```

> Kalau memungkinkan, minta dibuatkan **user Oracle read-only** khusus (bukan pakai akun admin/SYSTEM) — supaya script sync tidak sengaja bisa menulis balik ke database Bakeuda kalau ada bug di query.

### 2.4 Revisi `src/lib/oracle-client.ts`

```typescript
import oracledb from 'oracledb';

export async function getOracleConnection() {
  return oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
  });
}
```

### 2.5 Perluasan `src/scripts/sync-znt-oracle.ts` — Tambah Sync DBKB

```typescript
async function syncZnt(connection: oracledb.Connection) {
  // Placeholder nama tabel — GANTI setelah kamu cek struktur asli lewat DBeaver/SQL Developer
  const result = await connection.execute(`SELECT KODE_ZNT, NILAI_PER_M2, TAHUN FROM DAT_ZNT`);
  for (const row of result.rows as any[]) {
    await prisma.referensiZnt.upsert({
      where: { kode_znt_tahun: { kode_znt: row[0], tahun_berlaku: row[2] } } as any,
      create: { kode_znt: row[0], nilai_per_m2: row[1], tahun_berlaku: row[2], sumber_data: 'ORACLE_SYNC', synced_at: new Date() },
      update: { nilai_per_m2: row[1], sumber_data: 'ORACLE_SYNC', synced_at: new Date() },
    });
  }
}

async function syncDbkb(connection: oracledb.Connection) {
  // Placeholder nama tabel — GANTI setelah kamu cek struktur asli
  const result = await connection.execute(`SELECT KATEGORI, KODE, NILAI_PER_M2, TAHUN FROM DAT_DBKB`);
  for (const row of result.rows as any[]) {
    await prisma.referensiDbkb.upsert({
      where: { kategori_kode_tahun_berlaku: { kategori: row[0], kode: row[1], tahun_berlaku: row[3] } } as any,
      create: { kategori: row[0], kode: row[1], nilai_per_m2: row[2], tahun_berlaku: row[3], sumber_data: 'ORACLE_SYNC', synced_at: new Date() },
      update: { nilai_per_m2: row[2], sumber_data: 'ORACLE_SYNC', synced_at: new Date() },
    });
  }
}

async function syncNilaiFasilitas(connection: oracledb.Connection) {
  // Placeholder — GANTI setelah tahu apakah Bakeuda punya tabel ini sama sekali
  // (kemungkinan besar TIDAK ADA di Oracle lama, karena form SPOP fasilitas belum tentu
  // pernah dipakai untuk kalkulasi otomatis di sistem SISMIOP lama — perlu dikonfirmasi)
  const result = await connection.execute(`SELECT JENIS_FASILITAS, NILAI_TAMBAH, TAHUN FROM DAT_NILAI_FASILITAS`);
  // ...pola sama seperti di atas
}

async function main() {
  const connection = await getOracleConnection();
  try {
    await syncZnt(connection);
    await syncDbkb(connection);
    await syncNilaiFasilitas(connection);
    console.log('✅ Sinkronisasi ZNT + DBKB berhasil');
  } finally {
    await connection.close();
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

> ⚠️ **Semua nama tabel/kolom di atas (`DAT_ZNT`, `DAT_DBKB`, `DAT_NILAI_FASILITAS`, dst) masih PLACEHOLDER**, sama seperti status `DAT_ZNT` sebelumnya — bukan nama asli. Begitu kamu bisa `SELECT * FROM ALL_TABLES` atau buka lewat DBeaver/SQL Developer ke Oracle lokal itu, kirim struktur tabel yang sebenarnya, saya sesuaikan query-nya persis.

### 2.6 Kemungkinan Tabel Nilai Fasilitas TIDAK Ada di Oracle Lama

Perlu diantisipasi: form SPOP bagian Fasilitas (kolam renang, lift, dst) itu **data pendataan fisik**, belum tentu sistem SISMIOP lama (Oracle) pernah punya tabel "nilai tambah per fasilitas" untuk kalkulasi otomatis — bisa jadi dulu dihitung manual oleh petugas penilai (appraisal manual), bukan sistem otomatis. Kalau setelah dicek ternyata memang tidak ada tabelnya di Oracle, `ReferensiNilaiFasilitas` tetap perlu diisi **manual oleh BAKEUDA** lewat endpoint CRUD (bukan sync otomatis) — perlu dibuatkan endpoint `POST/PUT /referensi-nilai-fasilitas` juga kalau skenario ini yang terjadi.

---

## Ringkasan Status

| Komponen | Bisa Dikerjakan Sekarang? | Menunggu Apa |
|---|---|---|
| Schema `ReferensiDbkb`, `ReferensiNilaiFasilitas` | ✅ Ya | — |
| Formula kalkulator (`pbb-calculator.ts`) | ✅ Ya, dengan placeholder | Validasi rumus resmi dari Bakeuda (section 1.5 catatan) |
| Endpoint hitung ulang NJOP bangunan | ✅ Ya | — |
| Seeder placeholder (nilai `0`) | ✅ Ya | — |
| Koneksi Oracle lokal (`oracle-client.ts`) | ✅ Ya, strukturnya | Instalasi Oracle Instant Client di mesin kamu |
| Query sync ZNT & DBKB dari Oracle | ⚠️ Struktur kode siap | Nama tabel/kolom asli — cek manual dulu pas database sudah running |
| Isi nilai Rupiah asli | ❌ Tidak bisa sekarang | Data resmi dari Bakeuda |

---

## Urutan Eksekusi

1. Tambahkan schema `ReferensiDbkb` & `ReferensiNilaiFasilitas` (section 1.2, 1.3)
2. Migrasi + jalankan seeder placeholder (section 1.4)
3. Implementasikan `pbb-calculator.ts` dengan formula placeholder (section 1.5)
4. Tambahkan endpoint hitung ulang NJOP bangunan (section 1.6)
5. Install Oracle Instant Client + paket `oracledb` di mesin lokal
6. Setup `.env` Oracle (section 2.3), test koneksi dasar dulu (`SELECT 1 FROM DUAL`) sebelum lanjut query tabel asli
7. Begitu Oracle sudah running & bisa diakses via DBeaver/SQL Developer, cek struktur tabel ZNT dan DBKB yang sebenarnya
8. Sesuaikan query di `syncZnt()`, `syncDbkb()`, `syncNilaiFasilitas()` dengan nama tabel/kolom asli
9. Jalankan sync manual sekali, verifikasi data masuk ke `ReferensiDbkb`/`ReferensiZnt`
10. Setelah nilai asli masuk, jalankan `hitungUlangNjopBangunan()` untuk semua objek pajak existing, bandingkan hasilnya dengan NJOP yang pernah dihitung manual (kalau ada) sebagai validasi
