# Fitur — Kode Blok Otomatis (`ReferensiBlok`)

Lanjutan dari `alur-transaksi-spop-workflow.md` dan `eksekusi-sync-oracle-struktur-asli.md`. Dokumen ini fokus khusus ke fitur `ReferensiBlok` — supaya kode blok yang diinput petugas otomatis "terdaftar" dan bisa dipilih dari dropdown di pendaftaran berikutnya, tanpa perlu menunggu sinkronisasi Oracle.

> ⚠️ **Catatan penting:** field **NIP** (`nip_pendata`, `nip_pemeriksa`, `nip_perekam`, dan field tanggal terkait `tgl_pendataan`/`tgl_pemeriksaan`/`tgl_perekaman`) yang sempat direncanakan di `ObjekPajak`/`ObjekBangunan`/`ObjekBumi` pada dokumen `eksekusi-sync-oracle-struktur-asli.md` **sudah tidak dipakai / dihapus dari rencana**. Kode di dokumen ini **tidak menyertakan field NIP apapun** — kalau kamu sudah sempat menerapkan revisi NIP dari dokumen sebelumnya, field tersebut boleh di-rollback/dihapus dari schema.

---

## 1. Schema — `ReferensiBlok`

```prisma
model ReferensiBlok {
  id_blok      String   @id @default(uuid())
  kode_wilayah String   @db.VarChar(10) // FK ke Wilayah
  kode_blok    String   @db.VarChar(3)
  keterangan   String?  @db.VarChar(100)
  sumber_data  String   @default("MANUAL") // "MANUAL" (diisi otomatis dari input petugas) atau "ORACLE_SYNC" (nanti kalau sync Oracle jalan)
  created_at   DateTime @default(now())

  wilayah Wilayah @relation(fields: [kode_wilayah], references: [kode_wilayah])

  @@unique([kode_wilayah, kode_blok])
  @@index([kode_wilayah])
  @@map("referensi_blok")
}
```

Tambahkan relasi balik di `models/wilayah.prisma`:
```prisma
model Wilayah {
  // ...field yang sudah ada...
  blok ReferensiBlok[] // BARU
}
```

Migrasi:
```bash
npx prisma migrate dev --name tambah_referensi_blok
```

---

## 2. DTO — Pastikan `kode_blok_baru` Tetap Teks Bebas

Cek `DetailTujuanInputDto` di `dto/submit-transaksi.dto.ts` — pastikan **tidak ada** validasi `@IsIn([...])` atau enum tertutup untuk field ini:

```typescript
class DetailTujuanInputDto {
  // ...field lain yang sudah ada...

  @IsOptional()
  @IsString()
  @Length(1, 3) // maksimal 3 karakter sesuai VarChar(3) di schema ObjekPajak.kode_blok
  kode_blok_baru?: string; // TEKS BEBAS — dropdown di frontend cuma bantuan UX, backend tidak boleh membatasi ke daftar tertutup
}
```

> Kalau field ini divalidasi ketat ke daftar tertutup, petugas akan macet total setiap kali blok belum pernah terdaftar — termasuk yang pertama kali menginisiasi blok baru.

---

## 3. Service — Endpoint Read untuk Dropdown

### 3.1 `ReferensiBlokService`

Buat module baru `src/referensi-blok/`:

```typescript
// referensi-blok.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReferensiBlokService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /referensi-blok?kode_wilayah=xxx — untuk isi dropdown
  async findByWilayah(kodeWilayah: string) {
    const data = await this.prisma.referensiBlok.findMany({
      where: { kode_wilayah: kodeWilayah },
      orderBy: { kode_blok: 'asc' },
    });
    return { success: true, total: data.length, data };
  }

  // POST /referensi-blok — BAKEUDA tambah blok manual (jarang dipakai, karena biasanya auto-terisi dari transaksi)
  async create(kodeWilayah: string, kodeBlok: string, keterangan?: string) {
    const wilayah = await this.prisma.wilayah.findUnique({ where: { kode_wilayah: kodeWilayah } });
    if (!wilayah) throw new NotFoundException('Kode wilayah tidak ditemukan');

    const existing = await this.prisma.referensiBlok.findUnique({
      where: { kode_wilayah_kode_blok: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok } },
    });
    if (existing) throw new ConflictException('Kode blok ini sudah terdaftar untuk wilayah tersebut');

    const created = await this.prisma.referensiBlok.create({
      data: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok, keterangan, sumber_data: 'MANUAL' },
    });
    return { success: true, message: 'Blok berhasil ditambahkan', data: created };
  }
}
```

### 3.2 `ReferensiBlokController`

```typescript
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ReferensiBlokService } from './referensi-blok.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('referensi-blok')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferensiBlokController {
  constructor(private readonly service: ReferensiBlokService) {}

  @Get()
  async findByWilayah(@Query('kode_wilayah') kodeWilayah: string) {
    return this.service.findByWilayah(kodeWilayah);
  }

  @Post()
  @Roles('BAKEUDA')
  async create(@Body() body: { kode_wilayah: string; kode_blok: string; keterangan?: string }) {
    return this.service.create(body.kode_wilayah, body.kode_blok, body.keterangan);
  }
}
```

### 3.3 `ReferensiBlokModule`

```typescript
import { Module } from '@nestjs/common';
import { ReferensiBlokController } from './referensi-blok.controller.js';
import { ReferensiBlokService } from './referensi-blok.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReferensiBlokController],
  providers: [ReferensiBlokService],
  exports: [ReferensiBlokService],
})
export class ReferensiBlokModule {}
```

Daftarkan `ReferensiBlokModule` ke `imports` di `app.module.ts`.

---

## 4. Inti Fitur — Auto-Upsert di `TransaksiSpopService`

Ini bagian **paling penting** — tanpa ini, `ReferensiBlok` tidak akan pernah terisi dari alur normal.

### 4.1 `eksekusiBaru()`

```typescript
private async eksekusiBaru(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const t = transaksi.detail_tujuan[0];
  const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);

  const kodeWilayah = t.kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
  if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');

  const kodeBlok = t.kode_blok_baru || '001';

  const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: kodeBlok, kode_jenis_op: '1' }, tx);

  const objek = await tx.objekPajak.create({
    data: {
      nop,
      kode_wilayah: kodeWilayah,
      kode_blok: kodeBlok,
      no_urut: nop.substring(13, 17),
      kode_jenis_op: '1',
      nik_subjek: nikSubjek,
      no_persil: t.no_persil_baru,
      jalan_op: t.jalan_op_baru ?? '',
      blok_kav_no: t.blok_kav_no_baru,
      rw_op: t.rw_op_baru,
      rt_op: t.rt_op_baru,
      jenis_tanah: t.jenis_tanah_baru,
      luas_tanah: t.luas_tanah_baru,
      luas_bangunan: t.luas_bangunan_baru ?? 0,
      jumlah_bangunan: t.jumlah_bangunan_baru ?? 0,
      status_aktif: true,
    },
  });

  // ── BARU — auto-daftarkan kode blok kalau belum ada di ReferensiBlok ──
  await tx.referensiBlok.upsert({
    where: { kode_wilayah_kode_blok: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok } },
    create: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok, sumber_data: 'MANUAL' },
    update: {}, // sudah ada, tidak ada yang perlu diubah
  });

  await this.upsertLspop(tx, t, nop, false);
  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });

  return { nop_baru: nop };
}
```

### 4.2 `eksekusiPecah()` — Hybrid: Default Ikut Blok Induk, Bisa Di-Override Manual

Karena tanah yang dipecah secara fisik masih di lokasi yang sama dengan induknya, kode blok **otomatis diambil dari induk** kalau petugas tidak isi manual. Kalau petugas memang perlu (misal pemecahan yang kebetulan lintas batas blok), tetap bisa di-override lewat `kode_blok_baru`.

```typescript
private async eksekusiPecah(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const asal = transaksi.detail_asal[0];

  // Ambil data objek asal SEBELUM dinonaktifkan — dipakai untuk fallback blok & alamat
  const objekAsal = await tx.objekPajak.findUnique({ where: { nop: asal.nop_asal! } });
  if (!objekAsal) throw new BadRequestException('Objek pajak asal tidak ditemukan');

  await tx.objekPajak.update({
    where: { nop: asal.nop_asal! },
    data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
  });

  const hasilNop: string[] = [];
  for (const t of transaksi.detail_tujuan) {
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);
    const kodeWilayah = t.kode_wilayah_baru || objekAsal.kode_wilayah;

    // ── HYBRID — pakai input manual DESA kalau diisi, fallback ke blok induk kalau kosong ──
    const kodeBlok = t.kode_blok_baru || objekAsal.kode_blok;

    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: kodeBlok, kode_jenis_op: '1' }, tx);

    await tx.objekPajak.create({
      data: {
        nop, kode_wilayah: kodeWilayah, kode_blok: kodeBlok, no_urut: nop.substring(13, 17), kode_jenis_op: '1',
        nik_subjek: nikSubjek, jalan_op: t.jalan_op_baru || objekAsal.jalan_op, jenis_tanah: t.jenis_tanah_baru,
        luas_tanah: t.luas_tanah_baru, luas_bangunan: t.luas_bangunan_baru ?? 0,
      },
    });

    // ── auto-daftarkan kode blok kalau belum ada di ReferensiBlok ──
    await tx.referensiBlok.upsert({
      where: { kode_wilayah_kode_blok: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok } },
      create: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok, sumber_data: 'MANUAL' },
      update: {},
    });

    await this.upsertLspop(tx, t, nop, false);
    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    hasilNop.push(nop);
  }
  return {
    nop_asal_dinonaktifkan: asal.nop_asal,
    nop_baru: hasilNop,
    blok_dari_induk: transaksi.detail_tujuan.map((t) => !t.kode_blok_baru), // array boolean per baris tujuan — true kalau pakai fallback
  };
}
```

### 4.3 `eksekusiGabung()` — Hybrid yang Sama, Fallback ke NOP Asal Pertama

Untuk `GABUNG`, kode blok tujuan juga dibuat **hybrid**: pakai input manual DESA kalau diisi, fallback ke blok **NOP asal pertama** di array `detail_asal` kalau kosong — konsisten dengan pola fallback alamat yang sudah diterapkan di `eksekusiGabung()` (lihat `alur-transaksi-spop-workflow.md` section 3.4, yang merevisi `luas_tanah`/`luas_bangunan` jadi auto-sum dan `jalan_op` fallback ke NOP asal pertama).

```typescript
private async eksekusiGabung(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const semuaObjekAsal = await tx.objekPajak.findMany({
    where: { nop: { in: transaksi.detail_asal.map((a) => a.nop_asal!) } },
  });

  const totalLuasTanah = semuaObjekAsal.reduce((sum, o) => sum + Number(o.luas_tanah), 0);
  const totalLuasBangunan = semuaObjekAsal.reduce((sum, o) => sum + Number(o.luas_bangunan), 0);
  const objekAsalPertama = semuaObjekAsal.find((o) => o.nop === transaksi.detail_asal[0].nop_asal);

  for (const asal of transaksi.detail_asal) {
    await tx.objekPajak.update({
      where: { nop: asal.nop_asal! },
      data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
    });
  }

  const t = transaksi.detail_tujuan[0];
  const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);
  const kodeWilayah = t.kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
  if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');

  // ── HYBRID — sama seperti PECAH, input manual diprioritaskan, fallback ke NOP asal pertama ──
  const kodeBlok = t.kode_blok_baru || objekAsalPertama?.kode_blok || '001';

  const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: kodeBlok, kode_jenis_op: '1' }, tx);

  await tx.objekPajak.create({
    data: {
      nop, kode_wilayah: kodeWilayah, kode_blok: kodeBlok, no_urut: nop.substring(13, 17), kode_jenis_op: '1',
      nik_subjek: nikSubjek,
      jalan_op: t.jalan_op_baru || objekAsalPertama?.jalan_op || '',
      blok_kav_no: t.blok_kav_no_baru || objekAsalPertama?.blok_kav_no || undefined,
      rw_op: t.rw_op_baru || objekAsalPertama?.rw_op || undefined,
      rt_op: t.rt_op_baru || objekAsalPertama?.rt_op || undefined,
      jenis_tanah: t.jenis_tanah_baru,
      luas_tanah: totalLuasTanah,
      luas_bangunan: totalLuasBangunan,
    },
  });

  // ── auto-daftarkan kode blok kalau belum ada di ReferensiBlok ──
  await tx.referensiBlok.upsert({
    where: { kode_wilayah_kode_blok: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok } },
    create: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok, sumber_data: 'MANUAL' },
    update: {},
  });

  await this.upsertLspop(tx, t, nop, false);
  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });

  return {
    nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal),
    nop_baru: nop,
    luas_tanah_hasil: totalLuasTanah,
    luas_bangunan_hasil: totalLuasBangunan,
    kode_blok_dipakai: kodeBlok,
    blok_dari_fallback: !t.kode_blok_baru,
    alamat_dari_fallback: !t.jalan_op_baru,
  };
}
```

> Field `blok_dari_induk`/`blok_dari_fallback` di hasil return itu opsional, tapi berguna ditampilkan ke BAKEUDA saat reviu — supaya mereka tahu apakah kode blok itu hasil ketikan manual DESA atau otomatis dari sistem, kalau-kalau perlu dicek ulang kebenarannya.

---

## 5. Checklist Testing

| # | Skenario | Expected |
|---|---|---|
| 5.1 | `GET /referensi-blok?kode_wilayah=<kode>` untuk desa yang belum pernah ada objek pajak sama sekali | `200`, `data: []` (array kosong, bukan error) |
| 5.2 | Submit transaksi `BARU` dengan `kode_blok_baru: "099"` (blok belum pernah ada) → submit → lock → approve | `200`, NOP berhasil dibuat |
| 5.3 | Setelah 5.2, `GET /referensi-blok?kode_wilayah=<kode>` | `200`, sekarang muncul 1 baris `kode_blok: "099"`, `sumber_data: "MANUAL"` |
| 5.4 | Submit transaksi `BARU` **kedua kalinya** dengan `kode_blok_baru: "099"` (blok yang sama seperti 5.2) | `200`, berhasil — `ReferensiBlok` **tidak duplikat** (masih 1 baris untuk blok itu, `upsert` bekerja) |
| 5.5 | Cek NOP hasil 5.4 | 13 digit pertama (`kode_wilayah` + `kode_blok`) sama dengan 5.2, tapi 4 digit `no_urut` bertambah 1 |
| 5.6 | Submit transaksi `PECAH` dari NOP asal blok `"099"`, **tanpa** isi `kode_blok_baru` di kedua `detail_tujuan` | Approve berhasil, **kedua** hasil pecahan otomatis dapat `kode_blok: "099"` (ikut induk), `blok_dari_induk: [true, true]` di response |
| 5.7 | Submit transaksi `PECAH` dari NOP asal blok `"099"`, salah satu `detail_tujuan` diisi manual `kode_blok_baru: "100"` | Approve berhasil, hasil pertama pakai `"100"` (override manual), hasil kedua tetap ikut induk `"099"` — `blok_dari_induk: [false, true]` |
| 5.8 | Submit transaksi `GABUNG` dari 2 NOP asal **beda blok** (misal `"099"` dan `"100"`), **tanpa** isi `kode_blok_baru` di `detail_tujuan` | Approve berhasil, NOP hasil gabungan otomatis pakai blok dari **NOP asal pertama** di array `detail_asal` (`blok_dari_fallback: true`) |
| 5.9 | Submit transaksi `GABUNG` yang sama seperti 5.8, tapi isi manual `kode_blok_baru: "101"` | NOP hasil gabungan pakai `"101"` (override manual), `blok_dari_fallback: false` |
| 5.10 | `POST /referensi-blok` manual oleh BAKEUDA dengan kode blok yang **sudah ada** | `409 Conflict` |
| 5.11 | `POST /referensi-blok` manual oleh DESA (bukan BAKEUDA) | `403 Forbidden` |
| 5.12 | Submit transaksi `BARU` **tanpa** isi `kode_blok_baru` sama sekali | `201`, otomatis pakai default `"001"`, `ReferensiBlok` untuk `"001"` ikut ter-upsert |

---

## 6. Urutan Eksekusi

1. Tambahkan schema `ReferensiBlok` (section 1), migrasi
2. Cek/perbaiki DTO `kode_blok_baru` supaya tetap teks bebas (section 2)
3. Buat module `ReferensiBlokService`, `Controller`, `Module` (section 3), daftarkan ke `app.module.ts`
4. Tambahkan logic auto-upsert di `eksekusiBaru()` (section 4.1)
5. Terapkan hybrid fallback + auto-upsert di `eksekusiPecah()` (section 4.2)
6. Terapkan hybrid fallback + auto-upsert di `eksekusiGabung()` (section 4.3)
7. Jalankan checklist testing (section 5), termasuk skenario override manual vs fallback otomatis
8. Informasikan ke tim frontend: field `kode_blok_baru` di form PECAH/GABUNG boleh dikosongkan (akan otomatis ikut induk/asal pertama), dropdown blok memanggil `GET /referensi-blok?kode_wilayah=xxx`, kalau hasilnya kosong tampilkan input teks bebas sebagai fallback (bukan blokir form)
