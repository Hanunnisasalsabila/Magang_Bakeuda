# Perbaikan — Validasi Soft Warning Selisih Luas Tanah (Khusus PECAH)

Lanjutan dari `alur-transaksi-spop-workflow.md`. Dokumen ini menambahkan validasi **soft warning** untuk transaksi `PECAH` — total luas tanah tujuan dibandingkan dengan luas asal, kalau selisihnya signifikan sistem **tetap menerima** tapi memberi peringatan eksplisit supaya BAKEUDA sadar saat reviu.

**Keputusan desain:** soft warning, bukan hard block — karena pemecahan tanah sering melibatkan pengukuran ulang di lapangan yang wajar sedikit berbeda dari data lama di sistem. BAKEUDA yang menentukan apakah selisih itu wajar (approve) atau perlu diperbaiki (minta revisi).

> ⚠️ **Perubahan dari versi sebelumnya:** validasi ini **awalnya dirancang untuk PECAH dan GABUNG**, tapi setelah `eksekusiGabung()` direvisi supaya luas tanah/bangunan **dihitung otomatis** dari total NOP asal (lihat `alur-transaksi-spop-workflow.md` section 3.4), transaksi `GABUNG` **tidak mungkin lagi punya selisih** — hasilnya matematis pasti sama persis dengan total asal. Validasi soft warning untuk `GABUNG` jadi **tidak diperlukan** dan dihapus dari dokumen ini. `PECAH` tetap butuh validasi ini karena DESA masih menentukan sendiri berapa luas tiap bagian hasil pecah (keputusan manusia berdasarkan pengukuran lapangan, bukan otomatis dari sistem).

**Cakupan:** validasi ini **hanya berlaku untuk `PECAH`** (1 asal → banyak tujuan).

---

## 1. Tambahkan Field Baru — Simpan Peringatan Terpisah dari Catatan BAKEUDA

### Kenapa Tidak Pakai `catatan_bakeuda` yang Sudah Ada

Field `catatan_bakeuda` dipakai BAKEUDA untuk menulis catatan mereka sendiri saat tolak/revisi. Kalau peringatan sistem ditulis ke field yang sama, nanti **tertimpa** begitu BAKEUDA mengisi catatan mereka sendiri (lihat `tolak()`/`mintaRevisi()` yang langsung `update` field itu). Perlu field terpisah supaya peringatan sistem **tetap terlihat** sepanjang siklus hidup transaksi, tidak hilang.

### Revisi `models/transaksi_spop.prisma`

Tambahkan field baru di model `TransaksiSpop`:

```prisma
model TransaksiSpop {
  id_transaksi       String         @id @default(uuid())
  // ...field yang sudah ada...

  peringatan_validasi String? @db.VarChar(500) // BARU — warning otomatis dari sistem, terpisah dari catatan_bakeuda

  // ...relasi yang sudah ada...
}
```

Migrasi:
```bash
npx prisma migrate dev --name tambah_peringatan_validasi_luas
```

---

## 2. Helper Validasi — `src/transaksi-spop/luas-validation.helper.ts`

```typescript
export interface HasilValidasiLuas {
  ada_selisih: boolean;
  pesan: string | null;
  luas_asal: number;
  luas_tujuan: number;
  selisih_persen: number;
}

const TOLERANSI_PERSEN = 2; // bisa disesuaikan — 2% dianggap wajar dari margin pengukuran ulang lapangan

export function validasiSelisihLuasPecah(
  luasAsal: number,
  totalLuasTujuan: number,
): HasilValidasiLuas {
  if (luasAsal <= 0) {
    return { ada_selisih: false, pesan: null, luas_asal: luasAsal, luas_tujuan: totalLuasTujuan, selisih_persen: 0 };
  }

  const selisih = Math.abs(totalLuasTujuan - luasAsal);
  const selisihPersen = (selisih / luasAsal) * 100;

  if (selisihPersen <= TOLERANSI_PERSEN) {
    return { ada_selisih: false, pesan: null, luas_asal: luasAsal, luas_tujuan: totalLuasTujuan, selisih_persen: selisihPersen };
  }

  const arah = totalLuasTujuan > luasAsal ? 'lebih besar' : 'lebih kecil';

  return {
    ada_selisih: true,
    pesan: `Peringatan: total luas hasil pemecahan (${totalLuasTujuan} m²) ${arah} ${selisihPersen.toFixed(1)}% dibanding luas asal (${luasAsal} m²). Mohon diperiksa kembali sebelum disetujui.`,
    luas_asal: luasAsal,
    luas_tujuan: totalLuasTujuan,
    selisih_persen: selisihPersen,
  };
}
```

> Angka `TOLERANSI_PERSEN = 2` masih **asumsi awal**, sama seperti nilai placeholder di kalkulator NJOP sebelumnya — silakan disesuaikan kalau nanti Bakeuda punya standar toleransi baku sendiri untuk selisih hasil ukur ulang tanah.
>
> Fungsi ini **khusus PECAH** — tidak ada lagi parameter `jenisTransaksi` karena `GABUNG` tidak memakai validasi ini sama sekali (lihat catatan di bagian atas dokumen).

---

## 3. Terapkan di `TransaksiSpopService.submitPengajuan()`

Tambahkan pengecekan **setelah** validasi jumlah detail, **sebelum** `create()`:

```typescript
import { validasiSelisihLuasPecah } from './luas-validation.helper.js';

async submitPengajuan(dto: SubmitTransaksiDto, currentUser: CurrentUser, asDraft: boolean) {
  this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);

  if (dto.detail_asal?.length) {
    for (const asal of dto.detail_asal) {
      const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
      if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
      if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
      assertWilayahAccess(currentUser, objek.kode_wilayah);
    }
  }

  // ...validasi kode_wilayah_baru yang sudah ada, tetap sama...

  // BARU — validasi selisih luas, KHUSUS PECAH (GABUNG tidak perlu, luas dihitung otomatis)
  let peringatanValidasi: string | null = null;

  if (dto.jenis_transaksi === 'PECAH' && dto.detail_asal?.length && dto.detail_tujuan?.length) {
    const objekAsal = await this.prisma.objekPajak.findUnique({ where: { nop: dto.detail_asal[0].nop_asal } });
    if (objekAsal) {
      const totalLuasTujuan = dto.detail_tujuan.reduce((sum, t) => sum + Number(t.luas_tanah_baru), 0);
      const hasil = validasiSelisihLuasPecah(Number(objekAsal.luas_tanah), totalLuasTujuan);
      if (hasil.ada_selisih) peringatanValidasi = hasil.pesan;
    }
  }

  const statusAjuan = asDraft ? 'DRAFT' : 'MENUNGGU';

  const transaksi = await this.prisma.transaksiSpop.create({
    data: {
      id_user: currentUser.id_user,
      tahun_pajak: dto.tahun_pajak,
      jenis_transaksi: dto.jenis_transaksi,
      no_sppt_lama: dto.no_sppt_lama,
      nama_pengaju: dto.nama_pengaju,
      no_formulir: dto.no_formulir,
      nop_bersama: dto.nop_bersama,
      menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
      tanggal_pengajuan: new Date(dto.tanggal_pengajuan),
      status_ajuan: statusAjuan,
      peringatan_validasi: peringatanValidasi, // BARU
      detail_asal: dto.detail_asal ? { create: dto.detail_asal.map((a) => ({ nop_asal: a.nop_asal, nonaktifkan_saat_disetujui: a.nonaktifkan_saat_disetujui ?? true })) } : undefined,
      detail_tujuan: dto.detail_tujuan ? { create: dto.detail_tujuan.map((t) => ({ ...t, calon_subjek_json: t.calon_subjek_json as any, data_bangunan_json: t.data_bangunan_json as any })) } : undefined,
      lampiran: dto.lampiran ? { create: dto.lampiran.map((l) => ({ ...l, uploaded_by: currentUser.id_user })) } : undefined,
    },
    include: { detail_asal: true, detail_tujuan: true },
  });

  await this.catatRiwayat(
    transaksi.id_transaksi,
    null,
    transaksi.status_ajuan,
    currentUser.id_user,
    peringatanValidasi ? `Pengajuan dibuat — ${peringatanValidasi}` : 'Pengajuan dibuat',
  );

  return {
    success: true,
    message: 'Pengajuan berhasil dibuat',
    data: transaksi,
    peringatan: peringatanValidasi, // ditampilkan langsung di response, supaya DESA juga sadar dari awal
  };
}
```

### Terapkan Juga di `saveDraft()`

Karena isi transaksi bisa diedit ulang saat status `DRAFT`/`REVISI` (lewat `POST /transaksi-spop/draft/:id`), validasi yang sama perlu dijalankan ulang di situ juga — supaya kalau DESA mengubah angka luas saat revisi, peringatan ikut ter-update (bisa jadi hilang kalau sudah diperbaiki, atau baru muncul kalau editnya malah bikin tambah selisih):

```typescript
async saveDraft(id_transaksi: string, dto: SubmitTransaksiDto, currentUser: CurrentUser) {
  // ...validasi existing & role check yang sudah ada...

  this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);

  // BARU — hitung ulang peringatan validasi (logic sama seperti submitPengajuan, bisa diekstrak jadi 1 private method bersama)
  const peringatanValidasi = await this.hitungPeringatanValidasiLuas(dto);

  await this.prisma.$transaction(async (tx) => {
    await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi } });
    await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi } });
    await tx.lampiranDokumen.deleteMany({ where: { id_transaksi } });

    await tx.transaksiSpop.update({
      where: { id_transaksi },
      data: {
        // ...field lain yang sudah ada...
        peringatan_validasi: peringatanValidasi, // BARU — timpa dengan hasil terbaru (bisa jadi null kalau sudah diperbaiki)
        // ...detail_asal, detail_tujuan, lampiran yang sudah ada...
      },
    });
  });

  // ...return yang sudah ada...
}
```

> **Refactor disarankan:** ekstrak logic penghitungan peringatan (blok `if (dto.jenis_transaksi === 'PECAH' ...)` dan `'GABUNG'`) jadi 1 private method `hitungPeringatanValidasiLuas(dto)` yang dipanggil dari `submitPengajuan()` **dan** `saveDraft()` — supaya tidak duplikasi kode di 2 tempat.

---

## 4. Tampilkan di `getDetail()` — Supaya BAKEUDA Lihat Saat Reviu

Field `peringatan_validasi` otomatis ikut ter-include karena `getDetail()` sudah `SELECT *` (default Prisma include semua scalar field). Tidak perlu perubahan kode tambahan — cukup pastikan field ini terlihat jelas di response, dan idealnya **frontend BAKEUDA menampilkannya sebagai banner/alert** di halaman reviu, bukan tersembunyi di antara field lain.

Opsional — tambahkan juga ke `list()` supaya BAKEUDA bisa filter/lihat sekilas transaksi mana saja yang punya peringatan tanpa buka detail satu-satu:

```typescript
async list(query: any, currentUser: CurrentUser) {
  // ...existing code...

  if (query.ada_peringatan === 'true') {
    where.peringatan_validasi = { not: null };
  }

  // ...sisanya sama...
}
```

Endpoint: `GET /transaksi-spop?ada_peringatan=true` — BAKEUDA bisa lihat khusus daftar yang butuh perhatian ekstra.

---

## 5. Checklist Testing — Soft Warning PECAH

| # | Skenario | Expected |
|---|---|---|
| 5.1 | Submit `PECAH` — total luas tujuan **persis sama** dengan luas asal (misal 40+60=100) | `peringatan: null`, `peringatan_validasi: null` di database |
| 5.2 | Submit `PECAH` — total luas tujuan **beda tipis** dalam toleransi (misal 100 asal, tujuan totalnya 101 = beda 1%) | `peringatan: null` (masih dalam toleransi 2%) |
| 5.3 | Submit `PECAH` — total luas tujuan **jauh lebih kecil** (misal 100 asal, tujuan cuma 80) | `peringatan` terisi pesan, transaksi **tetap `201 Created`**, bukan ditolak |
| 5.4 | Submit `PECAH` — total luas tujuan **jauh lebih besar** (misal 100 asal, tujuan totalnya 130) | `peringatan` terisi, tetap `201` |
| 5.5 | `GET /transaksi-spop/<id>` setelah 5.3 | Response memuat `peringatan_validasi` dengan pesan yang sama |
| 5.6 | BAKEUDA lock lalu **approve** transaksi yang punya peringatan (5.3) | Tetap berhasil diproses — **peringatan tidak memblokir approve**, murni informasi |
| 5.7 | BAKEUDA lock lalu **minta revisi** dengan alasan terkait peringatan luas | `200`, `status_ajuan: "REVISI"`, `catatan_bakeuda` (beda dari `peringatan_validasi`) terisi alasan BAKEUDA |
| 5.8 | DESA edit ulang draft (5.7) dengan luas yang sudah diperbaiki, submit lagi | `peringatan_validasi` jadi `null` lagi (karena `saveDraft()` menghitung ulang) |
| 5.9 | `GET /transaksi-spop?ada_peringatan=true` | Hasil cuma transaksi yang `peringatan_validasi` tidak null |
| 5.10 | Transaksi `BARU`, `MUTASI`, `PERUBAHAN_DATA`, `HAPUS`, **`GABUNG`** — submit dengan data apapun | `peringatan_validasi` selalu `null` — validasi ini **cuma berlaku untuk PECAH** |

## 6. Checklist Testing — Auto-Sum & Fallback Alamat GABUNG (Terpisah dari Soft Warning)

Testing ini untuk perubahan `eksekusiGabung()` di `alur-transaksi-spop-workflow.md`, dicantumkan di sini karena berkaitan langsung dengan alasan `GABUNG` dikeluarkan dari soft warning.

| # | Skenario | Expected |
|---|---|---|
| 6.1 | Submit `GABUNG` — isi `luas_tanah_baru` di `detail_tujuan` dengan angka **sembarang/salah** (misal `9999`) | Sistem **mengabaikan** angka itu — hasil `luas_tanah` NOP baru = total sebenarnya dari NOP asal, bukan `9999` |
| 6.2 | Submit `GABUNG` — **tidak isi** `luas_tanah_baru` sama sekali | `201` tetap berhasil (field ini sekarang opsional), `luas_tanah` NOP baru = auto-sum |
| 6.3 | Submit `GABUNG` — isi `jalan_op_baru` secara eksplisit | NOP baru pakai alamat yang diisi manual, `alamat_dari_fallback: false` di response `approve` |
| 6.4 | Submit `GABUNG` — **tidak isi** `jalan_op_baru` | NOP baru pakai alamat dari NOP asal **pertama** di array `detail_asal`, `alamat_dari_fallback: true` di response `approve` |
| 6.5 | Verifikasi manual — 2 NOP asal luasnya 40 dan 60, approve transaksi GABUNG | `luas_tanah_hasil` di response approve = `100`, cocok dengan `GET /objek-pajak/<NOP_BARU>` |

---

## 7. Urutan Eksekusi

1. **Terapkan dulu perubahan `eksekusiGabung()`** di `alur-transaksi-spop-workflow.md` (auto-sum luas + fallback alamat) — dokumen ini mengasumsikan itu sudah diterapkan
2. Tambahkan field `peringatan_validasi` ke schema `TransaksiSpop` (section 1)
3. Jalankan migrasi
4. Buat helper `validasiSelisihLuasPecah()` (section 2)
5. Terapkan di `submitPengajuan()` — **khusus cabang `PECAH`** (section 3)
6. Ekstrak jadi private method bersama, terapkan juga di `saveDraft()` (section 3)
7. Tambahkan filter opsional `ada_peringatan` di `list()` (section 4)
8. Jalankan checklist testing soft warning PECAH (section 5) **dan** auto-sum/fallback GABUNG (section 6)
9. Informasikan ke tim frontend supaya `peringatan_validasi` ditampilkan jelas (banner/alert) di halaman reviu BAKEUDA untuk transaksi PECAH, dan field `luas_tanah_baru`/`luas_bangunan_baru` di form GABUNG dijadikan **read-only/dihilangkan** dari input (karena sekarang auto-hitung)
