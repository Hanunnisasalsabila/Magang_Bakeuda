# Perintah Perbaikan — Modul Subjek Pajak & Objek Pajak (Selaraskan dengan Formulir SPOP Fisik)

Dokumen ini berisi instruksi lengkap untuk memperbaiki **schema Prisma, DTO, service, dan controller** pada modul `SubjekPajak` dan `ObjekPajak` agar sesuai dengan formulir kertas **SPOP (Surat Pemberitahuan Objek Pajak)** — Pemkab Purbalingga, Badan Keuangan Daerah.

Referensi sumber: hasil pembacaan 3 foto formulir SPOP (formulir induk + 2 lampiran data bangunan).

---

## 0. Ringkasan Gap yang Ditemukan

| # | Area | Masalah | Prioritas |
|---|---|---|---|
| 1 | `enum JenisTanah` | Isi enum salah konteks (pertanian/perkebunan/kehutanan), form minta Tanah+Bangunan/Kavling Siap Bangun/Tanah Kosong/Fasilitas Umum | 🔴 Tinggi |
| 2 | `ObjekBangunan` — Fasilitas | Seluruh section "B. Fasilitas" di form (AC, kolam renang, lift, pagar, dll) tidak ada di schema | 🔴 Tinggi |
| 3 | `ObjekBangunan` — Daya Listrik | Field tidak ada sama sekali | 🟡 Sedang |
| 4 | `enum StatusWp` | Tidak ada `SENGKETA`; `PENGGARAP` perlu diklarifikasi vs "Pengelola" di form | 🟡 Sedang |
| 5 | `enum Pekerjaan` | Tidak ada opsi `BADAN` (badan usaha) | 🟡 Sedang |
| 6 | Response `update()` di `SubjekPajakService` | Tidak mapping `dibuat_oleh` seperti method lain → struktur response tidak konsisten | 🟢 Rendah |

---

## 1. Perbaikan `models/subjek_pajak.prisma`

### 1.1 Ubah `enum StatusWp`

**Sebelum:**
```prisma
enum StatusWp {
  PEMILIK
  PENYEWA
  PENGGARAP
  PEMAKAI
}
```

**Sesudah:**
```prisma
enum StatusWp {
  PEMILIK
  PENYEWA
  PENGELOLA   // ganti dari PENGGARAP — sesuai istilah form field 7
  PEMAKAI
  SENGKETA    // baru — form field 7 opsi ke-5
}
```

> ⚠️ **Konfirmasi dulu ke user/Bakeuda:** apakah `PENGGARAP` memang salah ketik dari "Pengelola", atau memang disengaja beda istilah karena ada kasus bisnis lain (contoh: tanah garapan pertanian). Kalau `PENGGARAP` masih dipakai di data existing, jangan langsung rename — buat migrasi yang aman (lihat bagian 5).

### 1.2 Ubah `enum Pekerjaan`

**Sebelum:**
```prisma
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
```

**Sesudah:**
```prisma
enum Pekerjaan {
  PNS
  TNI_POLRI
  PEGAWAI_SWASTA
  WIRASWASTA
  PETANI
  NELAYAN
  PENSIUNAN
  BADAN       // baru — form field 8 opsi "4. Badan"
  LAINNYA
}
```

### 1.3 Model `SubjekPajak` — tidak ada perubahan struktur

Field yang sudah ada (`nik`, `nama_subjek`, `npwp`, `no_hp`, `alamat_jalan`, `blok_kav_no_subjek`, `rw`, `rt`, `kelurahan`, `kecamatan`, `kabupaten`, `kode_pos`) **sudah sesuai** dengan form field 6, 9-18. Tidak perlu diubah.

---

## 2. Perbaikan `models/objek_pajak.prisma`

### 2.1 Ganti total `enum JenisTanah`

**Sebelum:**
```prisma
enum JenisTanah {
  TANAH_BANGUNAN
  TANAH_PERTANIAN
  TANAH_PERKEBUNAN
  TANAH_KEHUTANAN
  TANAH_LAINNYA
}
```

**Sesudah (sesuai form field 27):**
```prisma
enum JenisTanah {
  TANAH_BANGUNAN        // 1. Tanah + Bangunan
  KAVLING_SIAP_BANGUN   // 2. Kavling Siap Bangun
  TANAH_KOSONG          // 3. Tanah Kosong
  FASILITAS_UMUM        // 4. Fasilitas Umum
}
```

> ⚠️ **Konfirmasi ke user:** kalau desa yang ditangani sistem ini juga punya banyak objek pajak berupa sawah/kebun/hutan (di luar cakupan form SPOP kota/desa terstruktur ini), enum lama mungkin memang dibutuhkan untuk kasus lain. Kalau tidak, hapus total dan pakai versi form. Kalau data lama (Oracle) sudah terlanjur pakai nilai lama, siapkan mapping migrasi (lihat bagian 5.2).

### 2.2 Model `ObjekPajak` (header) — tidak ada perubahan struktur

Field yang sudah ada (`no_persil`, `jalan_op`, `blok_kav_no`, `rw_op`, `rt_op`, `kelurahan_op`, `kecamatan_op`, `jenis_tanah`, `luas_tanah`) **sudah sesuai** form field 19-27 (kecuali isi enum `jenis_tanah` di atas).

### 2.3 Model `ObjekBumi` — tidak ada perubahan struktur

`kode_znt`, `luas_bumi` sudah sesuai form field 25-26. Tidak perlu diubah.

### 2.4 Model `ObjekBangunan` — tambah field `daya_listrik`

Tambahkan setelah `jumlah_lantai`:

```prisma
model ObjekBangunan {
  id_bangunan           String   @id @default(uuid())
  nop                   String   @db.VarChar(18)
  no_bangunan           Int
  kode_jpb              String?  @db.VarChar(2)
  no_formulir_lspop     String?  @db.VarChar(11)
  tahun_dibangun        Int?
  tahun_renovasi        Int?
  luas_bangunan         Decimal  @default(0) @db.Decimal(12, 2)
  jumlah_lantai         Int      @default(1)
  daya_listrik_watt     Int?     // BARU — form lampiran field 10
  kondisi_bangunan      String?  @db.VarChar(1)
  jenis_konstruksi      String?  @db.VarChar(1)
  jenis_atap            String?  @db.VarChar(1)
  kode_dinding          String?  @db.VarChar(1)
  kode_lantai           String?  @db.VarChar(1)
  kode_langit_langit    String?  @db.VarChar(1)
  nilai_sistem_bangunan Decimal? @db.Decimal(15, 2)
  tanggal_pendataan     DateTime @default(now())
  nip_pendata           String?  @db.VarChar(20)
  keterangan_jpb        String?  @db.VarChar(50)
  created_at            DateTime @default(now())

  objek_pajak ObjekPajak            @relation(fields: [nop], references: [nop], onDelete: Cascade)
  fasilitas   ObjekBangunanFasilitas?

  @@unique([nop, no_bangunan])
  @@map("objek_bangunan")
}
```

### 2.5 Model BARU — `ObjekBangunanFasilitas`

Buat file baru `prisma/models/objek_bangunan_fasilitas.prisma`, atau tambahkan di `objek_pajak.prisma`:

```prisma
// ─────────────────────────────────────────
// FASILITAS BANGUNAN — 1-to-1 dengan ObjekBangunan
// Sesuai Lampiran SPOP bagian B. FASILITAS (field 17-27)
// ─────────────────────────────────────────

model ObjekBangunanFasilitas {
  id_fasilitas String @id @default(uuid())
  id_bangunan  String @unique @db.VarChar(36)

  // 17. AC
  jumlah_ac_split  Int @default(0)
  jumlah_ac_window Int @default(0)

  // 18. AC Sentral
  ac_sentral Boolean @default(false)

  // 19. Kolam Renang
  luas_kolam_renang     Decimal @default(0) @db.Decimal(10, 2)
  kolam_diplester       Boolean @default(false)
  kolam_dengan_pelapis  Boolean @default(false)

  // 20. Perkerasan Halaman (M2) — per kategori
  perkerasan_ringan          Decimal @default(0) @db.Decimal(10, 2)
  perkerasan_sedang          Decimal @default(0) @db.Decimal(10, 2)
  perkerasan_berat           Decimal @default(0) @db.Decimal(10, 2)
  perkerasan_dengan_penutup  Decimal @default(0) @db.Decimal(10, 2)

  // 21. Lapangan Tenis
  tenis_beton_dgn_lampu       Int @default(0)
  tenis_beton_tanpa_lampu     Int @default(0)
  tenis_aspal_dgn_lampu       Int @default(0)
  tenis_aspal_tanpa_lampu     Int @default(0)
  tenis_tanah_rumput_dgn_lampu   Int @default(0)
  tenis_tanah_rumput_tanpa_lampu Int @default(0)

  // 22. Lift
  lift_penumpang Int @default(0)
  lift_kapsul    Int @default(0)
  lift_barang    Int @default(0)

  // 23. Tangga Berjalan
  tangga_berjalan_lbr_kurang_080m Int @default(0)
  tangga_berjalan_lbr_lebih_080m  Int @default(0)

  // 24. Pagar
  panjang_pagar_m Decimal @default(0) @db.Decimal(10, 2)
  bahan_pagar     String? @db.VarChar(1) // 1=Baja/Besi, 2=Bata/Batako

  // 25. Pemadam Kebakaran
  hydrant_ada  Boolean @default(false)
  sprinkler_ada Boolean @default(false)
  fire_alarm_ada Boolean @default(false)

  // 26. Saluran PABX
  jumlah_saluran_pabx Int @default(0)

  // 27. Sumur Artesis
  kedalaman_sumur_artesis_m Decimal @default(0) @db.Decimal(6, 2)

  updated_at DateTime @updatedAt

  objek_bangunan ObjekBangunan @relation(fields: [id_bangunan], references: [id_bangunan], onDelete: Cascade)

  @@map("objek_bangunan_fasilitas")
}
```

> 💡 **Catatan desain:** dibuat 1-to-1 (bukan digabung ke `ObjekBangunan`) supaya tabel utama tidak terlalu gemuk, dan fasilitas bisa di-null/skip kalau bangunan sederhana tanpa fasilitas tambahan (mayoritas kasus rumah tinggal biasa).

### 2.6 Model BARU — `ReferensiJenisPenggunaanBangunan`

Buat file baru `prisma/models/referensi_jpb.prisma` (mengikuti pola `referensi_znt.prisma` yang sudah ada):

```prisma
// ─────────────────────────────────────────
// REFERENSI JENIS PENGGUNAAN BANGUNAN (JPB)
// Sesuai Lampiran SPOP field 5 — 16 opsi baku
// Dikelola BAKEUDA, dipakai sebagai sumber dropdown frontend
// ─────────────────────────────────────────

model ReferensiJenisPenggunaanBangunan {
  kode_jpb    String  @id @db.VarChar(2)
  nama_jpb    String  @db.VarChar(50)
  urutan      Int     @default(0)   // untuk urutan tampil di dropdown
  is_active   Boolean @default(true)
  keterangan  String? @db.VarChar(150)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  bangunan ObjekBangunan[]

  @@map("referensi_jenis_penggunaan_bangunan")
}
```

**Seed data awal** (16 opsi sesuai form lampiran field 5), jalankan lewat seeder terpisah `src/scripts/seed-referensi-jpb.ts`:

| kode_jpb | nama_jpb |
|---|---|
| 01 | Perumahan |
| 02 | Perkantoran Swasta |
| 03 | Pabrik |
| 04 | Toko/Apotik/Pasar/Ruko |
| 05 | Rumah Sakit/Klinik |
| 06 | Olah Raga/Rekreasi |
| 07 | Hotel/Wisma |
| 08 | Bengkel/Gudang/Pertanian |
| 09 | Gedung Pemerintah |
| 10 | Lain-lain |
| 11 | Bangunan Tidak Kena Pajak |
| 12 | Bangunan Parkir |
| 13 | Apartemen |
| 14 | Pompa Bensin |
| 15 | Tangki Minyak |
| 16 | Gedung Sekolah |

### 2.7 Ubah `ObjekBangunan.kode_jpb` jadi Foreign Key

**Sebelum:**
```prisma
kode_jpb String? @db.VarChar(2) // Jenis Penggunaan Bangunan
```

**Sesudah:**
```prisma
kode_jpb String? @db.VarChar(2)

referensi_jpb ReferensiJenisPenggunaanBangunan? @relation(fields: [kode_jpb], references: [kode_jpb])
```

Tambahkan index untuk performa query:
```prisma
@@index([kode_jpb])
```

---

## 3. Perbaikan DTO

### 3.1 `dto/create-subjek-pajak.dto.ts`

- Update validasi enum `status_wp` → tambah `SENGKETA`, ganti `PENGGARAP` → `PENGELOLA`
- Update validasi enum `pekerjaan` → tambah `BADAN`

### 3.2 `dto/create-objek-pajak.dto.ts`

- Update validasi enum `jenis_tanah` sesuai isi baru
- **Tambahkan nested optional object `fasilitas`** untuk create bangunan + fasilitas sekaligus (nested create), contoh struktur:

```typescript
class FasilitasBangunanDto {
  @IsOptional() @IsInt() jumlah_ac_split?: number;
  @IsOptional() @IsInt() jumlah_ac_window?: number;
  @IsOptional() @IsBoolean() ac_sentral?: boolean;
  @IsOptional() @IsNumber() luas_kolam_renang?: number;
  @IsOptional() @IsBoolean() kolam_diplester?: boolean;
  @IsOptional() @IsBoolean() kolam_dengan_pelapis?: boolean;
  @IsOptional() @IsNumber() perkerasan_ringan?: number;
  @IsOptional() @IsNumber() perkerasan_sedang?: number;
  @IsOptional() @IsNumber() perkerasan_berat?: number;
  @IsOptional() @IsNumber() perkerasan_dengan_penutup?: number;
  @IsOptional() @IsInt() tenis_beton_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_beton_tanpa_lampu?: number;
  @IsOptional() @IsInt() tenis_aspal_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_aspal_tanpa_lampu?: number;
  @IsOptional() @IsInt() tenis_tanah_rumput_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_tanah_rumput_tanpa_lampu?: number;
  @IsOptional() @IsInt() lift_penumpang?: number;
  @IsOptional() @IsInt() lift_kapsul?: number;
  @IsOptional() @IsInt() lift_barang?: number;
  @IsOptional() @IsInt() tangga_berjalan_lbr_kurang_080m?: number;
  @IsOptional() @IsInt() tangga_berjalan_lbr_lebih_080m?: number;
  @IsOptional() @IsNumber() panjang_pagar_m?: number;
  @IsOptional() @IsString() bahan_pagar?: string;
  @IsOptional() @IsBoolean() hydrant_ada?: boolean;
  @IsOptional() @IsBoolean() sprinkler_ada?: boolean;
  @IsOptional() @IsBoolean() fire_alarm_ada?: boolean;
  @IsOptional() @IsInt() jumlah_saluran_pabx?: number;
  @IsOptional() @IsNumber() kedalaman_sumur_artesis_m?: number;
}

class ObjekBangunanDto {
  // ...field existing...
  @IsOptional() @IsInt() daya_listrik_watt?: number;
  @IsOptional() @ValidateNested() @Type(() => FasilitasBangunanDto)
  fasilitas?: FasilitasBangunanDto;
}
```

### 3.4 DTO BARU — `dto/create-referensi-jpb.dto.ts` & `dto/update-referensi-jpb.dto.ts`

```typescript
export class CreateReferensiJpbDto {
  @IsString() @Length(2, 2) kode_jpb: string;
  @IsString() @MaxLength(50) nama_jpb: string;
  @IsOptional() @IsInt() urutan?: number;
  @IsOptional() @IsString() @MaxLength(150) keterangan?: string;
}

export class UpdateReferensiJpbDto extends PartialType(CreateReferensiJpbDto) {
  @IsOptional() @IsBoolean() is_active?: boolean;
}
```

### 3.3 `dto/update-subjek-pajak.dto.ts` & `dto/update-objek-pajak.dto.ts`

Sinkronkan enum yang sama seperti create DTO (biasanya `PartialType(CreateXxxDto)` — kalau sudah pakai pattern ini di NestJS, otomatis ikut ter-update, tinggal dicek ulang.

---

## 4. Perbaikan Service

### 4.1 `SubjekPajakService.update()` — samakan struktur response

**Sebelum:**
```typescript
async update(nik: string, dto: UpdateSubjekPajakDto) {
  const existing = await this.prisma.subjekPajak.findUnique({ where: { nik } });
  if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

  const { nik: _nik, ...updateData } = dto as any;
  const updated = await this.prisma.subjekPajak.update({
    where: { nik },
    data: updateData,
  });
  return { success: true, message: 'Subjek pajak berhasil diupdate', data: updated };
}
```

**Sesudah** (tambahkan `include` + mapping `dibuat_oleh` sama seperti `create()` dan `getByNik()`):
```typescript
async update(nik: string, dto: UpdateSubjekPajakDto) {
  const existing = await this.prisma.subjekPajak.findUnique({ where: { nik } });
  if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

  const { nik: _nik, ...updateData } = dto as any;
  const updated = await this.prisma.subjekPajak.update({
    where: { nik },
    data: updateData,
    include: { user: { select: { nama_lengkap: true } } },
  });

  const { user, created_by, ...rest } = updated;
  return {
    success: true,
    message: 'Subjek pajak berhasil diupdate',
    data: { ...rest, dibuat_oleh: user?.nama_lengkap ?? null },
  };
}
```

### 4.2 `ObjekPajakService.create()` — dukung nested create fasilitas

Saat membuat objek pajak baru dengan bangunan, sertakan nested create untuk `fasilitas` kalau dikirim di payload:

```typescript
async create(dto: CreateObjekPajakDto, createdBy: string) {
  // ... generate NOP, validasi subjek, dst (existing logic) ...

  const objek = await this.prisma.objekPajak.create({
    data: {
      // ...field header...
      bumi: { create: dto.bumi },
      bangunan: {
        create: dto.bangunan?.map((b) => ({
          ...b,
          fasilitas: b.fasilitas ? { create: b.fasilitas } : undefined,
        })),
      },
    },
    include: {
      bumi: true,
      bangunan: { include: { fasilitas: true } },
    },
  });

  return { success: true, message: 'Objek pajak berhasil ditambahkan', data: objek };
}
```

### 4.3 Endpoint BARU untuk update fasilitas bangunan

Tambahkan method di `ObjekPajakService`:

```typescript
async updateFasilitasBangunan(idBangunan: string, dto: UpdateFasilitasBangunanDto) {
  const bangunan = await this.prisma.objekBangunan.findUnique({
    where: { id_bangunan: idBangunan },
    include: { fasilitas: true },
  });
  if (!bangunan) throw new NotFoundException('Objek bangunan tidak ditemukan');

  const updated = await this.prisma.objekBangunanFasilitas.upsert({
    where: { id_bangunan: idBangunan },
    create: { id_bangunan: idBangunan, ...dto },
    update: dto,
  });

  return { success: true, message: 'Fasilitas bangunan berhasil diupdate', data: updated };
}
```

> Pakai `upsert` karena fasilitas bersifat opsional — bangunan sederhana mungkin belum punya record fasilitas sama sekali sampai pertama kali diisi.

---

### 4.4 Module BARU — `ReferensiJpbService`

Buat module baru (folder `src/referensi-jpb/`), pola sama seperti modul referensi ZNT yang sudah ada:

```typescript
@Injectable()
export class ReferensiJpbService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /referensi-jpb — untuk dropdown, hanya yang aktif
  async findAllActive() {
    return this.prisma.referensiJenisPenggunaanBangunan.findMany({
      where: { is_active: true },
      orderBy: { urutan: 'asc' },
    });
  }

  // GET /referensi-jpb/all — untuk admin, termasuk yang nonaktif
  async findAll() {
    return this.prisma.referensiJenisPenggunaanBangunan.findMany({
      orderBy: { urutan: 'asc' },
    });
  }

  // POST /referensi-jpb — BAKEUDA only
  async create(dto: CreateReferensiJpbDto) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: dto.kode_jpb },
    });
    if (existing) throw new ConflictException('Kode JPB sudah terdaftar');

    return this.prisma.referensiJenisPenggunaanBangunan.create({ data: dto });
  }

  // PUT /referensi-jpb/:kode — BAKEUDA only
  async update(kode: string, dto: UpdateReferensiJpbDto) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: kode },
    });
    if (!existing) throw new NotFoundException('Kode JPB tidak ditemukan');

    return this.prisma.referensiJenisPenggunaanBangunan.update({
      where: { kode_jpb: kode },
      data: dto,
    });
  }

  // DELETE /referensi-jpb/:kode — BAKEUDA only, soft-delete (nonaktifkan)
  async deactivate(kode: string) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: kode },
      include: { bangunan: { select: { id_bangunan: true }, take: 1 } },
    });
    if (!existing) throw new NotFoundException('Kode JPB tidak ditemukan');

    // Nonaktifkan saja, bukan hard delete — supaya data ObjekBangunan lama tetap valid
    return this.prisma.referensiJenisPenggunaanBangunan.update({
      where: { kode_jpb: kode },
      data: { is_active: false },
    });
  }
}
```

> ⚠️ **Kenapa soft-delete, bukan hard delete:** kalau ada `ObjekBangunan` yang sudah pakai `kode_jpb` tertentu lalu kodenya dihapus permanen, relasi foreign key akan rusak/gagal. Nonaktifkan (`is_active: false`) supaya kode lama tetap valid untuk data historis, tapi tidak muncul lagi di dropdown untuk data baru.

---

## 5. Perbaikan Controller

### 5.1 `ObjekPajakController` — tambah endpoint baru

```typescript
// PUT /objek-pajak/bangunan/:idBangunan/fasilitas
@Put('bangunan/:idBangunan/fasilitas')
@Roles('BAKEUDA')
async updateFasilitas(
  @Param('idBangunan') idBangunan: string,
  @Body() dto: UpdateFasilitasBangunanDto,
) {
  return this.objekPajakService.updateFasilitasBangunan(idBangunan, dto);
}
```

Role **BAKEUDA** dipilih karena fasilitas ikut memengaruhi perhitungan NJOP (nilai jual objek pajak) — sama seperti update NJOP lain yang sudah dibatasi role BAKEUDA di tabel endpoint sebelumnya.

### 5.2 `SubjekPajakController` — tidak perlu perubahan endpoint

Endpoint sudah lengkap; hanya DTO & service di baliknya yang berubah.

### 5.3 Controller BARU — `ReferensiJpbController`

```typescript
@Controller('referensi-jpb')
@UseGuards(JwtAuthGuard)
export class ReferensiJpbController {
  constructor(private readonly referensiJpbService: ReferensiJpbService) {}

  // GET /referensi-jpb — semua role, untuk isi dropdown
  @Get()
  async findAllActive() {
    return this.referensiJpbService.findAllActive();
  }

  // GET /referensi-jpb/all — BAKEUDA, lihat termasuk yang nonaktif
  @Get('all')
  @Roles('BAKEUDA')
  async findAll() {
    return this.referensiJpbService.findAll();
  }

  // POST /referensi-jpb — BAKEUDA only
  @Post()
  @Roles('BAKEUDA')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateReferensiJpbDto) {
    return this.referensiJpbService.create(dto);
  }

  // PUT /referensi-jpb/:kode — BAKEUDA only
  @Put(':kode')
  @Roles('BAKEUDA')
  async update(@Param('kode') kode: string, @Body() dto: UpdateReferensiJpbDto) {
    return this.referensiJpbService.update(kode, dto);
  }

  // DELETE /referensi-jpb/:kode — BAKEUDA only, soft-delete
  @Delete(':kode')
  @Roles('BAKEUDA')
  async deactivate(@Param('kode') kode: string) {
    return this.referensiJpbService.deactivate(kode);
  }
}
```

Tabel endpoint ringkas:

| Method | Endpoint | Role |
|---|---|---|
| GET | `/api/referensi-jpb` | Semua (dropdown) |
| GET | `/api/referensi-jpb/all` | BAKEUDA |
| POST | `/api/referensi-jpb` | BAKEUDA |
| PUT | `/api/referensi-jpb/:kode` | BAKEUDA |
| DELETE | `/api/referensi-jpb/:kode` (soft-delete) | BAKEUDA |

---

## 6. Migrasi Database & Data Existing

Karena ada perubahan **enum value** (`JenisTanah`, `StatusWp`, `Pekerjaan`) dan **penambahan model baru**, urutan migrasi yang aman:

1. **Backup database** sebelum migrasi apa pun.
2. Cek dulu apakah ada data existing yang memakai value enum lama (`TANAH_PERTANIAN`, `TANAH_PERKEBUNAN`, `TANAH_KEHUTANAN`, `PENGGARAP`):
   ```sql
   SELECT jenis_tanah, COUNT(*) FROM objek_pajak GROUP BY jenis_tanah;
   SELECT status_wp, COUNT(*) FROM subjek_pajak GROUP BY status_wp;
   ```
3. Kalau ada data lama:
   - Siapkan mapping manual (misal `TANAH_PERTANIAN` → mau dipetakan ke `TANAH_KOSONG` atau dipertahankan sebagai kategori tambahan — ini **keputusan bisnis**, bukan teknis, perlu dikonfirmasi ke user/Bakeuda dulu).
   - Jalankan `UPDATE` SQL manual untuk migrasi data SEBELUM `prisma migrate dev` mengubah enum, supaya tidak ada row yang gagal constraint.
4. Jalankan `npx prisma migrate dev --name fix_subjek_objek_sesuai_spop`
5. Cek hasil migrasi dengan `npx prisma studio` atau DBeaver — pastikan tabel baru `objek_bangunan_fasilitas` sudah muncul dan relasi 1-to-1 ke `objek_bangunan` benar.

---

## 7. Checklist Testing (Postman)

Update collection `pbb-system.postman_collection.json` dengan skenario tambahan:

- [ ] POST `/objek-pajak` dengan payload bangunan **tanpa** fasilitas → berhasil, `fasilitas: null`
- [ ] POST `/objek-pajak` dengan payload bangunan **+ fasilitas lengkap** → berhasil, semua field fasilitas tersimpan
- [ ] PUT `/objek-pajak/bangunan/:idBangunan/fasilitas` sebagai role DESA → **403 Forbidden**
- [ ] PUT `/objek-pajak/bangunan/:idBangunan/fasilitas` sebagai role BAKEUDA → **200 OK**
- [ ] POST `/subjek-pajak` dengan `status_wp: "SENGKETA"` → berhasil
- [ ] POST `/subjek-pajak` dengan `pekerjaan: "BADAN"` → berhasil
- [ ] POST `/subjek-pajak` dengan `status_wp: "PENGGARAP"` (enum lama) → **400 Bad Request** (validasi enum baru menolak value lama)
- [ ] PUT `/subjek-pajak/:nik` → cek response sekarang punya field `dibuat_oleh`, bukan `created_by` mentah
- [ ] GET `/referensi-jpb` sebagai role DESA → **200 OK**, hanya kode aktif
- [ ] POST `/referensi-jpb` sebagai role DESA → **403 Forbidden**
- [ ] POST `/referensi-jpb` sebagai role BAKEUDA dengan 16 seed data → berhasil semua
- [ ] POST `/referensi-jpb` dengan `kode_jpb` yang sudah ada → **409 Conflict**
- [ ] DELETE `/referensi-jpb/:kode` yang sedang dipakai `ObjekBangunan` → berhasil nonaktif, data `ObjekBangunan` lama tetap utuh (bukan hard delete)
- [ ] POST `/objek-pajak` dengan `kode_jpb` yang tidak terdaftar di tabel referensi → **400/500** sesuai constraint FK

---

## 8. Hal yang Masih Perlu Dikonfirmasi ke User/Bakeuda Sebelum Eksekusi

1. **`JenisTanah`** — apakah kategori pertanian/perkebunan/kehutanan tetap dibutuhkan untuk objek pajak di luar cakupan form SPOP ini? Kalau iya, enum perlu digabung (bukan diganti total), misal jadi 2 grup atau ditambah field terpisah `kategori_lahan`.
2. **`PENGGARAP` vs `PENGELOLA`** — konfirmasi apakah ini salah ketik/beda istilah yang disengaja.

> **Catatan:** perhitungan pengaruh fasilitas bangunan ke NJOP (`pbb-calculator.ts`) **ditunda dulu** — tidak dikerjakan di iterasi ini. Fasilitas hanya disimpan sebagai data pendataan untuk saat ini.

### 8.1 Keputusan — Jenis Penggunaan Bangunan (JPB): Tabel Referensi, bukan Enum

**Sudah diputuskan: pakai tabel referensi**, mengikuti pola `ReferensiZnt` yang sudah ada di proyek. Alasan:
- Bisa dikelola BAKEUDA lewat endpoint admin tanpa perlu migrasi/redeploy tiap ada perubahan kategori.
- Butuh metadata lebih dari sekadar nama konstanta (kode 2 digit, label, urutan tampil, status aktif).
- Konsisten dengan rencana tabel referensi Blok & Jenis OP (poin 10.2, 10.3 di ringkasan proyek) — semua "master data dropdown" pakai pola yang sama.

Detail schema, DTO, service, dan endpoint ada di **section 2.6** dan **section 3.4** di bawah.

---

## 9. Urutan Eksekusi yang Disarankan

1. Konfirmasi 2 poin di section 8 ke user/Bakeuda (`JenisTanah`, `PENGGARAP` vs `PENGELOLA`) — perhitungan NJOP fasilitas **ditunda**, JPB **sudah diputuskan pakai tabel referensi**
2. Update schema Prisma (section 1, 2, termasuk model baru `ObjekBangunanFasilitas` & `ReferensiJenisPenggunaanBangunan`)
3. Cek & migrasi data existing kalau ada (section 6)
4. Jalankan `npx prisma migrate dev --name fix_subjek_objek_sesuai_spop`
5. Buat & jalankan seeder `src/scripts/seed-referensi-jpb.ts` (isi 16 data awal di section 2.6)
6. Update DTO (section 3)
7. Update service, termasuk module baru `ReferensiJpbService` (section 4)
8. Update controller, termasuk module baru `ReferensiJpbController` (section 5)
9. Update Postman collection (section 7)
10. Regenerasi dokumentasi `modul-wilayah-subjek-objek-sppt.md` supaya sinkron dengan perubahan ini, termasuk tambahkan modul Referensi JPB ke daftar endpoint total
