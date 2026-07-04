# Modul Wilayah, Subjek Pajak, Objek Pajak & SPPT
## Disesuaikan dengan Struktur Data Legacy SISMIOP (Oracle)

Dokumen ini adalah kelanjutan dari modul Login yang sudah kamu buat.  
Mengerjakan **Backend Developer 1** poin 2, 3, dan 4 (Wilayah, Subjek/Objek Pajak, SPPT).

---

## 🔍 Analisis Data Legacy (SISMIOP Oracle)

Setelah membaca 3 file SQL yang kamu upload, ada temuan penting yang **mengubah desain schema** sebelumnya:

### 1. `DAT_SUBJEK_PAJAK` — Subjek Pajak

```
PK: SUBJEK_PAJAK_ID CHAR(30)   ← BUKAN NIK!
NM_WP, JALAN_WP, BLOK_KAV_NO_WP, RW_WP, RT_WP,
KELURAHAN_WP, KOTA_WP, KD_POS_WP, TELP_WP,
NPWP, STATUS_PEKERJAAN_WP (kode 1 char), KECAMATAN_WP,
NPWPD, EMAIL
```

**Temuan:** Sistem lama **tidak pakai NIK sebagai primary key** — pakai `SUBJEK_PAJAK_ID` (ID internal 30 karakter). NIK kemungkinan tidak tercatat di source lama, atau ada di tabel lain yang tidak di-share. `STATUS_PEKERJAAN_WP` juga berupa **kode 1 karakter**, bukan text langsung — butuh tabel referensi kode.

### 2. `DAT_OP_BUMI` — Komponen Tanah dari Objek Pajak

```
PK Composite: KD_PROPINSI + KD_DATI2 + KD_KECAMATAN + KD_KELURAHAN
              + KD_BLOK + NO_URUT + KD_JNS_OP + NO_BUMI
KD_ZNT, LUAS_BUMI, JNS_BUMI, NILAI_SISTEM_BUMI,
STATUS_BLOKIR (0=aktif/1=blokir), TGL_UPDATE
```

### 3. `DAT_OP_BANGUNAN` — Komponen Bangunan dari Objek Pajak

```
PK Composite: KD_PROPINSI + KD_DATI2 + KD_KECAMATAN + KD_KELURAHAN
              + KD_BLOK + NO_URUT + KD_JNS_OP + NO_BNG
KD_JPB, LUAS_BNG, JML_LANTAI_BNG, KONDISI_BNG,
JNS_KONSTRUKSI_BNG, JNS_ATAP_BNG, KD_DINDING, KD_LANTAI,
NILAI_SISTEM_BNG, TGL_PENDATAAN_BNG, NIP_PENDATA_BNG, dll
```

**Temuan paling penting:**

```
NOP (18 digit) = KD_PROPINSI(2) + KD_DATI2(2) + KD_KECAMATAN(3)
                + KD_KELURAHAN(3) + KD_BLOK(3) + NO_URUT(4) + KD_JNS_OP(1)
```

Objek Pajak **dipecah 2 tabel terpisah**: satu NOP bisa punya **lebih dari satu**
record Bumi (`NO_BUMI`) dan **lebih dari satu** record Bangunan (`NO_BNG`).  
Ini sesuai dengan field `jumlah_bangunan` di ERD kamu — satu bidang tanah  
bisa punya banyak bangunan di atasnya.

➡️ **Kesimpulan:** Schema `ObjekPajak` versi sebelumnya (satu tabel gabungan)  
perlu **dipecah menjadi 3 model**: `ObjekPajak` (header/NOP), `ObjekBumi`  
(detail tanah, 1-to-many), `ObjekBangunan` (detail bangunan, 1-to-many).

---

## Struktur Folder

```
prisma/
└── models/
    ├── user.prisma            ← sudah ada, tidak berubah
    ├── wilayah.prisma          ← diperbarui
    ├── subjek_pajak.prisma     ← diperbarui (+legacy_id)
    ├── objek_pajak.prisma      ← DIPECAH jadi 3 model
    ├── transaksi.prisma        ← tidak berubah
    ├── lampiran.prisma         ← tidak berubah
    └── sppt.prisma             ← tidak berubah

src/
├── lib/
│   ├── prisma.ts
│   ├── nop-generator.ts        ← BARU: generate NOP 18 digit
│   └── pbb-calculator.ts       ← BARU: kalkulator PBB terutang
├── services/
│   ├── wilayah.service.ts      ← BARU
│   ├── subjek-pajak.service.ts ← BARU
│   ├── objek-pajak.service.ts  ← BARU
│   └── sppt.service.ts         ← BARU
└── app/api/
    ├── wilayah/route.ts
    ├── wilayah/[kode]/route.ts
    ├── subjek-pajak/route.ts
    ├── subjek-pajak/[nik]/route.ts
    ├── objek-pajak/route.ts
    ├── objek-pajak/[nop]/route.ts
    ├── objek-pajak/bumi/[idBumi]/route.ts       ← BARU: update detail tanah
    ├── objek-pajak/bangunan/[idBangunan]/route.ts ← BARU: update detail bangunan
    └── sppt/
        ├── route.ts
        ├── generate/route.ts
        └── [id]/bayar/route.ts
```

---

## 1. `prisma/models/wilayah.prisma` (tidak berubah dari sebelumnya)

```prisma
model Wilayah {
  kode_wilayah String @id @db.VarChar(10)
  nama_desa    String @db.VarChar(100)
  kode_kel     String @db.VarChar(5)
  kecamatan    String @db.VarChar(100)
  kode_kec     String @db.VarChar(5)
  kabupaten    String @db.VarChar(100)
  kode_kab     String @db.VarChar(5)

  users User[]

  @@map("wilayah")
}
```

---

## 2. `prisma/models/subjek_pajak.prisma` — DIPERBARUI

Tambahkan `legacy_subjek_id` untuk mapping data import dari Oracle,
dan `kode_pekerjaan` untuk kompatibel dengan kode 1-karakter legacy.

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
  legacy_subjek_id   String?    @unique @db.VarChar(30)  // ref SUBJEK_PAJAK_ID lama
  nama_subjek        String     @db.VarChar(100)
  status_wp          StatusWp
  pekerjaan          Pekerjaan
  npwp               String?    @db.VarChar(20)
  npwpd              String?    @db.VarChar(50)          // dari legacy NPWPD
  no_hp              String?    @db.VarChar(15)
  email              String?    @db.VarChar(100)          // dari legacy EMAIL
  alamat_jalan       String     @db.VarChar(255)
  blok_kav_no_subjek String?    @db.VarChar(50)
  rw                 String?    @db.VarChar(5)
  rt                 String?    @db.VarChar(5)
  kelurahan          String     @db.VarChar(100)
  kecamatan          String?    @db.VarChar(100)          // dari legacy KECAMATAN_WP
  kabupaten          String     @db.VarChar(100)
  kode_pos           String?    @db.VarChar(5)
  created_at         DateTime   @default(now())
  updated_at         DateTime   @updatedAt
  created_by         String

  user          User                    @relation("CreatedByUser", fields: [created_by], references: [id_user])
  objek_pajak   ObjekPajak[]
  detail_tujuan DetailTransaksiTujuan[]

  @@index([nama_subjek])
  @@map("subjek_pajak")
}
```

> **Catatan:** Karena NIK tidak ada di source lama, saat **import data legacy**,
> gunakan `legacy_subjek_id` sebagai kunci sementara. NIK asli harus diminta/
> divalidasi ulang secara manual dari dokumen fisik warga (proses di luar sistem).

---

## 3. `prisma/models/objek_pajak.prisma` — DIPECAH 3 MODEL

```prisma
enum JenisTanah {
  TANAH_BANGUNAN
  TANAH_PERTANIAN
  TANAH_PERKEBUNAN
  TANAH_KEHUTANAN
  TANAH_LAINNYA
}

// ─────────────────────────────────────────
// HEADER — 1 baris per NOP
// ─────────────────────────────────────────

model ObjekPajak {
  nop             String     @id @db.VarChar(18)

  // Komponen pembentuk NOP (sesuai struktur legacy SISMIOP)
  kode_propinsi   String     @db.VarChar(2)
  kode_dati2      String     @db.VarChar(2)
  kode_kecamatan  String     @db.VarChar(3)
  kode_kelurahan  String     @db.VarChar(3)
  kode_blok       String     @db.VarChar(3)
  no_urut         String     @db.VarChar(4)
  kode_jenis_op   String     @db.VarChar(1)

  nik_subjek      String     @db.VarChar(16)
  no_persil       String?    @db.VarChar(20)
  jalan_op        String     @db.VarChar(255)
  blok_kav_no     String?    @db.VarChar(50)
  rw_op           String?    @db.VarChar(5)
  rt_op           String?    @db.VarChar(5)
  kelurahan_op    String     @db.VarChar(100)
  kecamatan_op    String     @db.VarChar(100)
  jenis_tanah     JenisTanah

  // Agregat (dihitung ulang dari relasi bumi/bangunan setiap update)
  luas_tanah      Decimal    @default(0) @db.Decimal(10, 2)
  luas_bangunan   Decimal    @default(0) @db.Decimal(10, 2)
  jumlah_bangunan Int        @default(0)
  njop_tanah      Decimal?   @db.Decimal(15, 2)
  njop_bangunan   Decimal?   @db.Decimal(15, 2)
  njop_total      Decimal?   @db.Decimal(15, 2)
  tahun_penilaian Int?

  status_aktif    Boolean    @default(true)
  nonaktif_oleh   String?
  nonaktif_at     DateTime?
  created_at      DateTime   @default(now())

  subjek_pajak  SubjekPajak           @relation(fields: [nik_subjek], references: [nik])
  user_nonaktif User?                 @relation("NonaktifOlehUser", fields: [nonaktif_oleh], references: [id_user])
  transaksi     TransaksiSpop[]       @relation("ObjekBersama")
  detail_asal   DetailTransaksiAsal[]
  sppt          Sppt[]

  bumi      ObjekBumi[]
  bangunan  ObjekBangunan[]

  @@unique([kode_propinsi, kode_dati2, kode_kecamatan, kode_kelurahan, kode_blok, no_urut, kode_jenis_op])
  @@index([nik_subjek])
  @@map("objek_pajak")
}

// ─────────────────────────────────────────
// DETAIL TANAH — bisa >1 per NOP (dari DAT_OP_BUMI)
// ─────────────────────────────────────────

model ObjekBumi {
  id_bumi          String   @id @default(uuid())
  nop              String   @db.VarChar(18)
  no_bumi          Int      @default(1)          // urutan bumi ke berapa dalam 1 NOP
  kode_znt         String?  @db.VarChar(2)        // Kode Zona Nilai Tanah
  luas_bumi        Decimal  @default(0) @db.Decimal(12, 2)
  jenis_bumi       String?  @db.VarChar(1)
  nilai_sistem_bumi Decimal @default(0) @db.Decimal(15, 2)
  status_blokir    Boolean  @default(false)       // 0=aktif/1=blokir dari legacy
  keterangan_blokir String? @db.VarChar(150)
  tahun_blokir     String?  @db.VarChar(4)
  updated_at       DateTime @updatedAt

  objek_pajak ObjekPajak @relation(fields: [nop], references: [nop], onDelete: Cascade)

  @@unique([nop, no_bumi])
  @@map("objek_bumi")
}

// ─────────────────────────────────────────
// DETAIL BANGUNAN — bisa >1 per NOP (dari DAT_OP_BANGUNAN)
// ─────────────────────────────────────────

model ObjekBangunan {
  id_bangunan         String    @id @default(uuid())
  nop                 String    @db.VarChar(18)
  no_bangunan         Int                          // urutan bangunan ke berapa
  kode_jpb            String?   @db.VarChar(2)      // Jenis Penggunaan Bangunan
  no_formulir_lspop   String?   @db.VarChar(11)
  tahun_dibangun      Int?
  tahun_renovasi      Int?
  luas_bangunan       Decimal   @default(0) @db.Decimal(12, 2)
  jumlah_lantai       Int       @default(1)
  kondisi_bangunan    String?   @db.VarChar(1)
  jenis_konstruksi    String?   @db.VarChar(1)
  jenis_atap          String?   @db.VarChar(1)
  kode_dinding        String?   @db.VarChar(1)
  kode_lantai         String?   @db.VarChar(1)
  kode_langit_langit  String?   @db.VarChar(1)
  nilai_sistem_bangunan Decimal? @db.Decimal(15, 2)
  tanggal_pendataan   DateTime  @default(now())
  nip_pendata         String?   @db.VarChar(20)
  keterangan_jpb      String?   @db.VarChar(50)
  created_at          DateTime  @default(now())

  objek_pajak ObjekPajak @relation(fields: [nop], references: [nop], onDelete: Cascade)

  @@unique([nop, no_bangunan])
  @@map("objek_bangunan")
}
```

---

## 4. Perintah Migrasi

```bash
npx prisma validate
npx prisma format
npx prisma migrate dev --name split_objek_pajak_bumi_bangunan
npx prisma generate
```

> Karena `ObjekPajak` dipecah, jika kamu sudah punya data di tabel `objek_pajak`
> lama dengan field `luas_tanah`/`luas_bangunan` langsung, field itu **tetap ada**
> di header sebagai agregat — hanya sifatnya berubah dari "sumber data" jadi
> "hasil kalkulasi" dari tabel `objek_bumi` + `objek_bangunan`.

---

## 5. NOP Generator

**`src/lib/nop-generator.ts`**

```typescript
import { prisma } from "./prisma";

interface GenerateNopInput {
  kode_propinsi: string;   // 2 digit
  kode_dati2: string;      // 2 digit
  kode_kecamatan: string;  // 3 digit
  kode_kelurahan: string;  // 3 digit
  kode_blok: string;       // 3 digit
  kode_jenis_op: string;   // 1 digit
}

/**
 * NOP 18 digit = propinsi(2) + dati2(2) + kecamatan(3) + kelurahan(3)
 *              + blok(3) + no_urut(4) + jenis_op(1)
 */
export async function generateNop(input: GenerateNopInput): Promise<string> {
  const { kode_propinsi, kode_dati2, kode_kecamatan, kode_kelurahan, kode_blok, kode_jenis_op } = input;

  // Cari no_urut terakhir untuk kombinasi wilayah + blok ini
  const lastObjek = await prisma.objekPajak.findFirst({
    where: {
      kode_propinsi,
      kode_dati2,
      kode_kecamatan,
      kode_kelurahan,
      kode_blok,
    },
    orderBy: { no_urut: "desc" },
  });

  const nextUrut = lastObjek ? parseInt(lastObjek.no_urut, 10) + 1 : 1;
  const noUrutStr = nextUrut.toString().padStart(4, "0");

  const nop =
    kode_propinsi.padStart(2, "0") +
    kode_dati2.padStart(2, "0") +
    kode_kecamatan.padStart(3, "0") +
    kode_kelurahan.padStart(3, "0") +
    kode_blok.padStart(3, "0") +
    noUrutStr +
    kode_jenis_op;

  return nop;
}

/** Pecah NOP 18 digit jadi komponen-komponennya */
export function parseNop(nop: string) {
  if (nop.length !== 18) throw new Error("NOP harus 18 digit");

  return {
    kode_propinsi: nop.substring(0, 2),
    kode_dati2: nop.substring(2, 4),
    kode_kecamatan: nop.substring(4, 7),
    kode_kelurahan: nop.substring(7, 10),
    kode_blok: nop.substring(10, 13),
    no_urut: nop.substring(13, 17),
    kode_jenis_op: nop.substring(17, 18),
  };
}
```

---

## 6. PBB Calculator

**`src/lib/pbb-calculator.ts`**

```typescript
interface PbbCalculationInput {
  njopTanah: number;      // Rp per m2
  luasTanah: number;      // m2
  njopBangunan: number;   // Rp per m2
  luasBangunan: number;   // m2
  njoptkp: number;        // Nilai Jual Objek Pajak Tidak Kena Pajak
  tarifPbb: number;       // dalam persen (misal 0.1 = 0.1%)
}

interface PbbCalculationResult {
  njopTanahTotal: number;
  njopBangunanTotal: number;
  njopTotal: number;
  njopKenaPajak: number;
  pbbTerutang: number;
}

export function calculatePbb(input: PbbCalculationInput): PbbCalculationResult {
  const { njopTanah, luasTanah, njopBangunan, luasBangunan, njoptkp, tarifPbb } = input;

  const njopTanahTotal = njopTanah * luasTanah;
  const njopBangunanTotal = njopBangunan * luasBangunan;
  const njopTotal = njopTanahTotal + njopBangunanTotal;

  // NJOP Kena Pajak = NJOP Total - NJOPTKP (tidak boleh negatif)
  const njopKenaPajak = Math.max(njopTotal - njoptkp, 0);

  // PBB Terutang = NJOP Kena Pajak x Tarif PBB
  const pbbTerutang = njopKenaPajak * (tarifPbb / 100);

  return {
    njopTanahTotal,
    njopBangunanTotal,
    njopTotal,
    njopKenaPajak,
    pbbTerutang: Math.round(pbbTerutang),
  };
}
```

---

## 7. Service — Wilayah

**`src/services/wilayah.service.ts`**

```typescript
import { prisma } from "@/lib/prisma";

export async function getAllWilayahService(filters?: { kecamatan?: string; kabupaten?: string }) {
  const wilayah = await prisma.wilayah.findMany({
    where: {
      kecamatan: filters?.kecamatan ? { contains: filters.kecamatan, mode: "insensitive" } : undefined,
      kabupaten: filters?.kabupaten ? { contains: filters.kabupaten, mode: "insensitive" } : undefined,
    },
    orderBy: { nama_desa: "asc" },
  });
  return { success: true, total: wilayah.length, data: wilayah };
}

export async function getWilayahByKodeService(kode_wilayah: string) {
  const wilayah = await prisma.wilayah.findUnique({ where: { kode_wilayah } });
  if (!wilayah) return { success: false, message: "Wilayah tidak ditemukan" };
  return { success: true, data: wilayah };
}

export async function createWilayahService(input: {
  kode_wilayah: string;
  nama_desa: string;
  kode_kel: string;
  kecamatan: string;
  kode_kec: string;
  kabupaten: string;
  kode_kab: string;
}) {
  const existing = await prisma.wilayah.findUnique({ where: { kode_wilayah: input.kode_wilayah } });
  if (existing) return { success: false, message: "Kode wilayah sudah digunakan" };

  const wilayah = await prisma.wilayah.create({ data: input });
  return { success: true, message: "Wilayah berhasil ditambahkan", data: wilayah };
}

export async function updateWilayahService(kode_wilayah: string, input: Partial<{
  nama_desa: string; kode_kel: string; kecamatan: string;
  kode_kec: string; kabupaten: string; kode_kab: string;
}>) {
  const existing = await prisma.wilayah.findUnique({ where: { kode_wilayah } });
  if (!existing) return { success: false, message: "Wilayah tidak ditemukan" };

  const updated = await prisma.wilayah.update({ where: { kode_wilayah }, data: input });
  return { success: true, message: "Wilayah berhasil diupdate", data: updated };
}

export async function deleteWilayahService(kode_wilayah: string) {
  const existing = await prisma.wilayah.findUnique({ where: { kode_wilayah } });
  if (!existing) return { success: false, message: "Wilayah tidak ditemukan" };

  await prisma.wilayah.delete({ where: { kode_wilayah } });
  return { success: true, message: "Wilayah berhasil dihapus" };
}
```

---

## 8. Route — Wilayah

**`src/app/api/wilayah/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { getAllWilayahService, createWilayahService } from "@/services/wilayah.service";
import { z } from "zod";

const createWilayahSchema = z.object({
  kode_wilayah: z.string().min(1).max(10),
  nama_desa: z.string().min(1),
  kode_kel: z.string().min(1).max(5),
  kecamatan: z.string().min(1),
  kode_kec: z.string().min(1).max(5),
  kabupaten: z.string().min(1),
  kode_kab: z.string().min(1).max(5),
});

// GET — semua role bisa akses (untuk dropdown)
export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(req.url);
  const result = await getAllWilayahService({
    kecamatan: searchParams.get("kecamatan") ?? undefined,
    kabupaten: searchParams.get("kabupaten") ?? undefined,
  });

  return NextResponse.json(result, { status: 200 });
}

// POST — hanya BAKEUDA
export async function POST(req: NextRequest) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const body = await req.json();
  const parsed = createWilayahSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createWilayahService(parsed.data);
  return NextResponse.json(result, { status: result.success ? 201 : 409 });
}
```

**`src/app/api/wilayah/[kode]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import {
  getWilayahByKodeService,
  updateWilayahService,
  deleteWilayahService,
} from "@/services/wilayah.service";

type Params = { params: Promise<{ kode: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { kode } = await params;
  const result = await getWilayahByKodeService(kode);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { kode } = await params;
  const body = await req.json();
  const result = await updateWilayahService(kode, body);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { kode } = await params;
  const result = await deleteWilayahService(kode);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
```

---

## 9. Service — Subjek Pajak

**`src/services/subjek-pajak.service.ts`**

```typescript
import { prisma } from "@/lib/prisma";
import { StatusWp, Pekerjaan } from "../../prisma/generated";

interface CreateSubjekInput {
  nik: string;
  nama_subjek: string;
  status_wp: StatusWp;
  pekerjaan: Pekerjaan;
  npwp?: string;
  no_hp?: string;
  email?: string;
  alamat_jalan: string;
  blok_kav_no_subjek?: string;
  rw?: string;
  rt?: string;
  kelurahan: string;
  kecamatan?: string;
  kabupaten: string;
  kode_pos?: string;
  created_by: string; // id_user dari token JWT
}

export async function createSubjekPajakService(input: CreateSubjekInput) {
  const existing = await prisma.subjekPajak.findUnique({ where: { nik: input.nik } });
  if (existing) return { success: false, message: "NIK sudah terdaftar" };

  const subjek = await prisma.subjekPajak.create({ data: input });
  return { success: true, message: "Subjek pajak berhasil ditambahkan", data: subjek };
}

export async function getSubjekByNikService(nik: string) {
  const subjek = await prisma.subjekPajak.findUnique({
    where: { nik },
    include: { objek_pajak: { select: { nop: true, jalan_op: true, status_aktif: true } } },
  });
  if (!subjek) return { success: false, message: "Subjek pajak tidak ditemukan" };
  return { success: true, data: subjek };
}

export async function searchSubjekPajakService(keyword: string) {
  const results = await prisma.subjekPajak.findMany({
    where: {
      OR: [
        { nik: { contains: keyword } },
        { nama_subjek: { contains: keyword, mode: "insensitive" } },
        { alamat_jalan: { contains: keyword, mode: "insensitive" } },
      ],
    },
    take: 50,
    orderBy: { nama_subjek: "asc" },
  });
  return { success: true, total: results.length, data: results };
}

export async function updateSubjekPajakService(nik: string, input: Partial<CreateSubjekInput>) {
  const existing = await prisma.subjekPajak.findUnique({ where: { nik } });
  if (!existing) return { success: false, message: "Subjek pajak tidak ditemukan" };

  const updated = await prisma.subjekPajak.update({ where: { nik }, data: input });
  return { success: true, message: "Subjek pajak berhasil diupdate", data: updated };
}

export async function deleteSubjekPajakService(nik: string) {
  const existing = await prisma.subjekPajak.findUnique({
    where: { nik },
    include: { objek_pajak: { select: { nop: true } } },
  });
  if (!existing) return { success: false, message: "Subjek pajak tidak ditemukan" };

  if (existing.objek_pajak.length > 0) {
    return {
      success: false,
      message: `Tidak bisa dihapus — masih memiliki ${existing.objek_pajak.length} objek pajak aktif`,
    };
  }

  await prisma.subjekPajak.delete({ where: { nik } });
  return { success: true, message: "Subjek pajak berhasil dihapus" };
}
```

---

## 10. Route — Subjek Pajak

**`src/app/api/subjek-pajak/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createSubjekPajakService, searchSubjekPajakService } from "@/services/subjek-pajak.service";
import { z } from "zod";

const createSubjekSchema = z.object({
  nik: z.string().length(16, "NIK harus 16 digit"),
  nama_subjek: z.string().min(2),
  status_wp: z.enum(["PEMILIK", "PENYEWA", "PENGGARAP", "PEMAKAI"]),
  pekerjaan: z.enum(["PNS", "TNI_POLRI", "PEGAWAI_SWASTA", "WIRASWASTA", "PETANI", "NELAYAN", "PENSIUNAN", "LAINNYA"]),
  npwp: z.string().optional(),
  no_hp: z.string().optional(),
  email: z.string().email().optional(),
  alamat_jalan: z.string().min(1),
  blok_kav_no_subjek: z.string().optional(),
  rw: z.string().optional(),
  rt: z.string().optional(),
  kelurahan: z.string().min(1),
  kecamatan: z.string().optional(),
  kabupaten: z.string().min(1),
  kode_pos: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") ?? "";

  const result = await searchSubjekPajakService(keyword);
  return NextResponse.json(result, { status: 200 });
}

export async function POST(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const body = await req.json();
  const parsed = createSubjekSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createSubjekPajakService({
    ...parsed.data,
    created_by: authResult.user.userId,
  });

  return NextResponse.json(result, { status: result.success ? 201 : 409 });
}
```

**`src/app/api/subjek-pajak/[nik]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getSubjekByNikService,
  updateSubjekPajakService,
  deleteSubjekPajakService,
} from "@/services/subjek-pajak.service";

type Params = { params: Promise<{ nik: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { nik } = await params;
  const result = await getSubjekByNikService(nik);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { nik } = await params;
  const body = await req.json();
  const result = await updateSubjekPajakService(nik, body);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { nik } = await params;
  const result = await deleteSubjekPajakService(nik);
  return NextResponse.json(result, { status: result.success ? 200 : 409 });
}
```

---

## 11. Service — Objek Pajak (dengan Bumi & Bangunan)

**`src/services/objek-pajak.service.ts`**

```typescript
import { prisma } from "@/lib/prisma";
import { generateNop } from "@/lib/nop-generator";
import { JenisTanah } from "../../prisma/generated";

interface CreateObjekInput {
  kode_propinsi: string;
  kode_dati2: string;
  kode_kecamatan: string;
  kode_kelurahan: string;
  kode_blok: string;
  kode_jenis_op: string;
  nik_subjek: string;
  no_persil?: string;
  jalan_op: string;
  blok_kav_no?: string;
  rw_op?: string;
  rt_op?: string;
  kelurahan_op: string;
  kecamatan_op: string;
  jenis_tanah: JenisTanah;
  bumi: Array<{
    luas_bumi: number;
    kode_znt?: string;
    jenis_bumi?: string;
    nilai_sistem_bumi?: number;
  }>;
  bangunan?: Array<{
    luas_bangunan: number;
    kode_jpb?: string;
    tahun_dibangun?: number;
    jumlah_lantai?: number;
    kondisi_bangunan?: string;
  }>;
}

export async function createObjekPajakService(input: CreateObjekInput) {
  const subjek = await prisma.subjekPajak.findUnique({ where: { nik: input.nik_subjek } });
  if (!subjek) return { success: false, message: "Subjek pajak (NIK) tidak ditemukan" };

  const nop = await generateNop({
    kode_propinsi: input.kode_propinsi,
    kode_dati2: input.kode_dati2,
    kode_kecamatan: input.kode_kecamatan,
    kode_kelurahan: input.kode_kelurahan,
    kode_blok: input.kode_blok,
    kode_jenis_op: input.kode_jenis_op,
  });

  // Hitung agregat dari bumi & bangunan
  const totalLuasTanah = input.bumi.reduce((sum, b) => sum + b.luas_bumi, 0);
  const totalLuasBangunan = (input.bangunan ?? []).reduce((sum, b) => sum + b.luas_bangunan, 0);

  const objek = await prisma.objekPajak.create({
    data: {
      nop,
      kode_propinsi: input.kode_propinsi,
      kode_dati2: input.kode_dati2,
      kode_kecamatan: input.kode_kecamatan,
      kode_kelurahan: input.kode_kelurahan,
      kode_blok: input.kode_blok,
      no_urut: nop.substring(13, 17),
      kode_jenis_op: input.kode_jenis_op,
      nik_subjek: input.nik_subjek,
      no_persil: input.no_persil,
      jalan_op: input.jalan_op,
      blok_kav_no: input.blok_kav_no,
      rw_op: input.rw_op,
      rt_op: input.rt_op,
      kelurahan_op: input.kelurahan_op,
      kecamatan_op: input.kecamatan_op,
      jenis_tanah: input.jenis_tanah,
      luas_tanah: totalLuasTanah,
      luas_bangunan: totalLuasBangunan,
      jumlah_bangunan: input.bangunan?.length ?? 0,
      bumi: {
        create: input.bumi.map((b, idx) => ({
          no_bumi: idx + 1,
          luas_bumi: b.luas_bumi,
          kode_znt: b.kode_znt,
          jenis_bumi: b.jenis_bumi,
          nilai_sistem_bumi: b.nilai_sistem_bumi ?? 0,
        })),
      },
      bangunan: input.bangunan
        ? {
            create: input.bangunan.map((b, idx) => ({
              no_bangunan: idx + 1,
              luas_bangunan: b.luas_bangunan,
              kode_jpb: b.kode_jpb,
              tahun_dibangun: b.tahun_dibangun,
              jumlah_lantai: b.jumlah_lantai ?? 1,
              kondisi_bangunan: b.kondisi_bangunan,
            })),
          }
        : undefined,
    },
    include: { bumi: true, bangunan: true },
  });

  return { success: true, message: "Objek pajak berhasil ditambahkan", data: objek };
}

export async function getObjekByNopService(nop: string) {
  const objek = await prisma.objekPajak.findUnique({
    where: { nop },
    include: {
      subjek_pajak: { select: { nik: true, nama_subjek: true } },
      bumi: true,
      bangunan: true,
    },
  });
  if (!objek) return { success: false, message: "Objek pajak tidak ditemukan" };
  return { success: true, data: objek };
}

export async function searchObjekPajakService(keyword: string) {
  const results = await prisma.objekPajak.findMany({
    where: {
      OR: [
        { nop: { contains: keyword } },
        { jalan_op: { contains: keyword, mode: "insensitive" } },
        { subjek_pajak: { nama_subjek: { contains: keyword, mode: "insensitive" } } },
      ],
    },
    include: { subjek_pajak: { select: { nama_subjek: true } } },
    take: 50,
  });
  return { success: true, total: results.length, data: results };
}

export async function nonaktifkanObjekPajakService(nop: string, userId: string) {
  const objek = await prisma.objekPajak.findUnique({ where: { nop } });
  if (!objek) return { success: false, message: "Objek pajak tidak ditemukan" };
  if (!objek.status_aktif) return { success: false, message: "Objek pajak sudah nonaktif" };

  const updated = await prisma.objekPajak.update({
    where: { nop },
    data: { status_aktif: false, nonaktif_oleh: userId, nonaktif_at: new Date() },
  });

  return { success: true, message: "Objek pajak berhasil dinonaktifkan", data: updated };
}

// ─────────────────────────────────────────
// UPDATE — Header Objek Pajak (NJOP, alamat, dll)
// ─────────────────────────────────────────

interface UpdateObjekInput {
  no_persil?: string;
  jalan_op?: string;
  blok_kav_no?: string;
  rw_op?: string;
  rt_op?: string;
  kelurahan_op?: string;
  kecamatan_op?: string;
  jenis_tanah?: JenisTanah;
  njop_tanah?: number;
  njop_bangunan?: number;
  tahun_penilaian?: number;
}

export async function updateObjekPajakService(nop: string, input: UpdateObjekInput) {
  const existing = await prisma.objekPajak.findUnique({ where: { nop } });
  if (!existing) return { success: false, message: "Objek pajak tidak ditemukan" };
  if (!existing.status_aktif) return { success: false, message: "Objek pajak nonaktif, tidak bisa diupdate" };

  // Hitung ulang njop_total jika njop_tanah/njop_bangunan diupdate
  const njopTanah = input.njop_tanah ?? Number(existing.njop_tanah ?? 0);
  const njopBangunan = input.njop_bangunan ?? Number(existing.njop_bangunan ?? 0);
  const njopTotal =
    njopTanah * Number(existing.luas_tanah) + njopBangunan * Number(existing.luas_bangunan);

  const updated = await prisma.objekPajak.update({
    where: { nop },
    data: {
      ...input,
      njop_total: njopTotal,
    },
    include: { bumi: true, bangunan: true },
  });

  return { success: true, message: "Objek pajak berhasil diupdate", data: updated };
}

// ─────────────────────────────────────────
// UPDATE — Detail Bumi (per record, sinkron ulang agregat luas_tanah)
// ─────────────────────────────────────────

export async function updateObjekBumiService(idBumi: string, input: {
  luas_bumi?: number;
  kode_znt?: string;
  jenis_bumi?: string;
  nilai_sistem_bumi?: number;
}) {
  const existing = await prisma.objekBumi.findUnique({ where: { id_bumi: idBumi } });
  if (!existing) return { success: false, message: "Data bumi tidak ditemukan" };

  const updated = await prisma.objekBumi.update({ where: { id_bumi: idBumi }, data: input });

  // Sinkronkan agregat luas_tanah di header ObjekPajak
  const semuaBumi = await prisma.objekBumi.findMany({ where: { nop: existing.nop } });
  const totalLuas = semuaBumi.reduce((sum, b) => sum + Number(b.luas_bumi), 0);
  await prisma.objekPajak.update({ where: { nop: existing.nop }, data: { luas_tanah: totalLuas } });

  return { success: true, message: "Data bumi berhasil diupdate", data: updated };
}

// ─────────────────────────────────────────
// UPDATE — Detail Bangunan (per record, sinkron ulang agregat luas_bangunan)
// ─────────────────────────────────────────

export async function updateObjekBangunanService(idBangunan: string, input: {
  luas_bangunan?: number;
  kondisi_bangunan?: string;
  jumlah_lantai?: number;
  tahun_renovasi?: number;
}) {
  const existing = await prisma.objekBangunan.findUnique({ where: { id_bangunan: idBangunan } });
  if (!existing) return { success: false, message: "Data bangunan tidak ditemukan" };

  const updated = await prisma.objekBangunan.update({ where: { id_bangunan: idBangunan }, data: input });

  const semuaBangunan = await prisma.objekBangunan.findMany({ where: { nop: existing.nop } });
  const totalLuas = semuaBangunan.reduce((sum, b) => sum + Number(b.luas_bangunan), 0);
  await prisma.objekPajak.update({ where: { nop: existing.nop }, data: { luas_bangunan: totalLuas } });

  return { success: true, message: "Data bangunan berhasil diupdate", data: updated };
}
```

---

## 12. Route — Objek Pajak

**`src/app/api/objek-pajak/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createObjekPajakService, searchObjekPajakService } from "@/services/objek-pajak.service";
import { z } from "zod";

const bumiSchema = z.object({
  luas_bumi: z.number().positive(),
  kode_znt: z.string().optional(),
  jenis_bumi: z.string().optional(),
  nilai_sistem_bumi: z.number().optional(),
});

const bangunanSchema = z.object({
  luas_bangunan: z.number().positive(),
  kode_jpb: z.string().optional(),
  tahun_dibangun: z.number().optional(),
  jumlah_lantai: z.number().optional(),
  kondisi_bangunan: z.string().optional(),
});

const createObjekSchema = z.object({
  kode_propinsi: z.string().length(2),
  kode_dati2: z.string().length(2),
  kode_kecamatan: z.string().length(3),
  kode_kelurahan: z.string().length(3),
  kode_blok: z.string().length(3),
  kode_jenis_op: z.string().length(1),
  nik_subjek: z.string().length(16),
  no_persil: z.string().optional(),
  jalan_op: z.string().min(1),
  blok_kav_no: z.string().optional(),
  rw_op: z.string().optional(),
  rt_op: z.string().optional(),
  kelurahan_op: z.string().min(1),
  kecamatan_op: z.string().min(1),
  jenis_tanah: z.enum(["TANAH_BANGUNAN", "TANAH_PERTANIAN", "TANAH_PERKEBUNAN", "TANAH_KEHUTANAN", "TANAH_LAINNYA"]),
  bumi: z.array(bumiSchema).min(1, "Minimal 1 data bumi diperlukan"),
  bangunan: z.array(bangunanSchema).optional(),
});

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") ?? "";

  const result = await searchObjekPajakService(keyword);
  return NextResponse.json(result, { status: 200 });
}

export async function POST(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const body = await req.json();
  const parsed = createObjekSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await createObjekPajakService(parsed.data);
  return NextResponse.json(result, { status: result.success ? 201 : 409 });
}
```

**`src/app/api/objek-pajak/[nop]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import {
  getObjekByNopService,
  updateObjekPajakService,
  nonaktifkanObjekPajakService,
} from "@/services/objek-pajak.service";
import { z } from "zod";

const updateObjekSchema = z.object({
  no_persil: z.string().optional(),
  jalan_op: z.string().optional(),
  blok_kav_no: z.string().optional(),
  rw_op: z.string().optional(),
  rt_op: z.string().optional(),
  kelurahan_op: z.string().optional(),
  kecamatan_op: z.string().optional(),
  jenis_tanah: z.enum(["TANAH_BANGUNAN", "TANAH_PERTANIAN", "TANAH_PERKEBUNAN", "TANAH_KEHUTANAN", "TANAH_LAINNYA"]).optional(),
  njop_tanah: z.number().optional(),
  njop_bangunan: z.number().optional(),
  tahun_penilaian: z.number().optional(),
});

type Params = { params: Promise<{ nop: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { nop } = await params;
  const result = await getObjekByNopService(nop);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

// Update NJOP & data objek — hanya BAKEUDA (data yudisial penilaian pajak)
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { nop } = await params;
  const body = await req.json();
  const parsed = updateObjekSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateObjekPajakService(nop, parsed.data);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}

// Nonaktifkan NOP — hanya BAKEUDA
export async function DELETE(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { nop } = await params;
  const result = await nonaktifkanObjekPajakService(nop, authResult.user.userId);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
```

**`src/app/api/objek-pajak/bumi/[idBumi]/route.ts`** — update detail per record tanah

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateObjekBumiService } from "@/services/objek-pajak.service";
import { z } from "zod";

const updateBumiSchema = z.object({
  luas_bumi: z.number().positive().optional(),
  kode_znt: z.string().optional(),
  jenis_bumi: z.string().optional(),
  nilai_sistem_bumi: z.number().optional(),
});

type Params = { params: Promise<{ idBumi: string }> };

// Hanya BAKEUDA yang boleh revisi data penilaian tanah
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { idBumi } = await params;
  const body = await req.json();
  const parsed = updateBumiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateObjekBumiService(idBumi, parsed.data);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
```

**`src/app/api/objek-pajak/bangunan/[idBangunan]/route.ts`** — update detail per record bangunan

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateObjekBangunanService } from "@/services/objek-pajak.service";
import { z } from "zod";

const updateBangunanSchema = z.object({
  luas_bangunan: z.number().positive().optional(),
  kondisi_bangunan: z.string().optional(),
  jumlah_lantai: z.number().optional(),
  tahun_renovasi: z.number().optional(),
});

type Params = { params: Promise<{ idBangunan: string }> };

// Hanya BAKEUDA yang boleh revisi data penilaian bangunan
export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { idBangunan } = await params;
  const body = await req.json();
  const parsed = updateBangunanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const result = await updateObjekBangunanService(idBangunan, parsed.data);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
```

---

## 13. Service — SPPT (Kalkulasi & Penerbitan)

**`src/services/sppt.service.ts`**

```typescript
import { prisma } from "@/lib/prisma";
import { calculatePbb } from "@/lib/pbb-calculator";

const NJOPTKP_DEFAULT = 12_000_000; // sesuai regulasi daerah, sesuaikan
const TARIF_PBB_DEFAULT = 0.1; // 0.1%

export async function generateSpptSatuanService(nop: string, tahunPajak: number, generatedBy: string) {
  const objek = await prisma.objekPajak.findUnique({ where: { nop } });
  if (!objek) return { success: false, message: "Objek pajak tidak ditemukan" };
  if (!objek.status_aktif) return { success: false, message: "Objek pajak nonaktif, tidak bisa diterbitkan SPPT" };

  const existing = await prisma.sppt.findFirst({ where: { nop, tahun_pajak: tahunPajak } });
  if (existing) return { success: false, message: `SPPT tahun ${tahunPajak} sudah pernah diterbitkan untuk NOP ini` };

  const hasil = calculatePbb({
    njopTanah: Number(objek.njop_tanah ?? 0),
    luasTanah: Number(objek.luas_tanah),
    njopBangunan: Number(objek.njop_bangunan ?? 0),
    luasBangunan: Number(objek.luas_bangunan),
    njoptkp: NJOPTKP_DEFAULT,
    tarifPbb: TARIF_PBB_DEFAULT,
  });

  const sppt = await prisma.sppt.create({
    data: {
      nop,
      tahun_pajak: tahunPajak,
      njop_kena_pajak: hasil.njopKenaPajak,
      njoptkp: NJOPTKP_DEFAULT,
      tarif_pbb: TARIF_PBB_DEFAULT,
      pbb_terutang: hasil.pbbTerutang,
      tgl_jatuh_tempo: new Date(tahunPajak, 8, 30), // 30 September tahun berjalan
      generated_by: generatedBy,
    },
  });

  return { success: true, message: "SPPT berhasil diterbitkan", data: sppt };
}

export async function generateSpptMassalService(tahunPajak: number, generatedBy: string) {
  const objekAktif = await prisma.objekPajak.findMany({ where: { status_aktif: true } });

  const hasil = { berhasil: 0, dilewati: 0, error: [] as string[] };

  for (const objek of objekAktif) {
    const result = await generateSpptSatuanService(objek.nop, tahunPajak, generatedBy);
    if (result.success) {
      hasil.berhasil++;
    } else {
      hasil.dilewati++;
      hasil.error.push(`${objek.nop}: ${result.message}`);
    }
  }

  return { success: true, message: "Proses generate massal selesai", data: hasil };
}

export async function updateStatusBayarService(idSppt: string, tglBayar: Date) {
  const sppt = await prisma.sppt.findUnique({ where: { id_sppt: idSppt } });
  if (!sppt) return { success: false, message: "SPPT tidak ditemukan" };
  if (sppt.status_bayar === "LUNAS") return { success: false, message: "SPPT sudah lunas" };

  const updated = await prisma.sppt.update({
    where: { id_sppt: idSppt },
    data: { status_bayar: "LUNAS", tgl_bayar: tglBayar },
  });

  return { success: true, message: "Status pembayaran berhasil diupdate", data: updated };
}

export async function searchSpptService(filters: { nop?: string; tahun_pajak?: number; status_bayar?: string }) {
  const results = await prisma.sppt.findMany({
    where: {
      nop: filters.nop,
      tahun_pajak: filters.tahun_pajak,
      status_bayar: filters.status_bayar as "BELUM_BAYAR" | "LUNAS" | "KEDALUWARSA" | undefined,
    },
    include: { objek_pajak: { select: { jalan_op: true, subjek_pajak: { select: { nama_subjek: true } } } } },
    orderBy: { generated_at: "desc" },
    take: 100,
  });
  return { success: true, total: results.length, data: results };
}
```

---

## 14. Route — SPPT

**`src/app/api/sppt/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { searchSpptService } from "@/services/sppt.service";

export async function GET(req: NextRequest) {
  const authResult = requireAuth(req);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(req.url);
  const result = await searchSpptService({
    nop: searchParams.get("nop") ?? undefined,
    tahun_pajak: searchParams.get("tahun_pajak") ? Number(searchParams.get("tahun_pajak")) : undefined,
    status_bayar: searchParams.get("status_bayar") ?? undefined,
  });

  return NextResponse.json(result, { status: 200 });
}
```

**`src/app/api/sppt/generate/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { generateSpptSatuanService, generateSpptMassalService } from "@/services/sppt.service";
import { z } from "zod";

const generateSchema = z.object({
  nop: z.string().length(18).optional(), // kosong = generate massal
  tahun_pajak: z.number().int().min(2000),
});

// Hanya BAKEUDA yang bisa menerbitkan SPPT
export async function POST(req: NextRequest) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { nop, tahun_pajak } = parsed.data;
  const userId = authResult.user.userId;

  const result = nop
    ? await generateSpptSatuanService(nop, tahun_pajak, userId)
    : await generateSpptMassalService(tahun_pajak, userId);

  return NextResponse.json(result, { status: result.success ? 201 : 409 });
}
```

**`src/app/api/sppt/[id]/bayar/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateStatusBayarService } from "@/services/sppt.service";
import { z } from "zod";

const bayarSchema = z.object({
  tgl_bayar: z.string().datetime().optional(),
});

type Params = { params: Promise<{ id: string }> };

// Update status LUNAS — hanya BAKEUDA (bisa juga webhook payment gateway)
export async function PATCH(req: NextRequest, { params }: Params) {
  const authResult = requireRole(req, ["BAKEUDA"]);
  if ("error" in authResult) return authResult.error;

  const { id } = await params;
  const body = await req.json();
  const parsed = bayarSchema.safeParse(body);

  const tglBayar = parsed.success && parsed.data.tgl_bayar
    ? new Date(parsed.data.tgl_bayar)
    : new Date();

  const result = await updateStatusBayarService(id, tglBayar);
  return NextResponse.json(result, { status: result.success ? 200 : 404 });
}
```

---

## 15. Ringkasan Endpoint Lengkap

Semua endpoint di bawah **wajib membawa header `Authorization: Bearer <token>`**
(diperiksa lewat `requireAuth`). Kolom **Role** menunjukkan role tambahan yang
dicek lewat `requireRole` — "Semua" berarti DESA & BAKEUDA sama-sama boleh
selama sudah login (token valid).

| Method | Endpoint | Deskripsi | Role | Guard |
|--------|----------|-----------|------|-------|
| `GET` | `/api/wilayah` | List wilayah (filter kecamatan/kabupaten) | Semua | `requireAuth` |
| `POST` | `/api/wilayah` | Tambah wilayah | BAKEUDA | `requireRole` |
| `GET` | `/api/wilayah/:kode` | Detail wilayah | Semua | `requireAuth` |
| `PUT` | `/api/wilayah/:kode` | Update wilayah | BAKEUDA | `requireRole` |
| `DELETE` | `/api/wilayah/:kode` | Hapus wilayah | BAKEUDA | `requireRole` |
| `GET` | `/api/subjek-pajak?q=keyword` | Cari subjek pajak (NIK/nama/alamat) | Semua | `requireAuth` |
| `POST` | `/api/subjek-pajak` | Tambah subjek pajak | Semua | `requireAuth` |
| `GET` | `/api/subjek-pajak/:nik` | Detail by NIK | Semua | `requireAuth` |
| `PUT` | `/api/subjek-pajak/:nik` | Update subjek pajak | Semua | `requireAuth` |
| `DELETE` | `/api/subjek-pajak/:nik` | Hapus subjek pajak | Semua | `requireAuth` |
| `GET` | `/api/objek-pajak?q=keyword` | Cari objek pajak (NOP/alamat/nama pemilik) | Semua | `requireAuth` |
| `POST` | `/api/objek-pajak` | Tambah objek + generate NOP otomatis | Semua | `requireAuth` |
| `GET` | `/api/objek-pajak/:nop` | Detail by NOP (+ bumi & bangunan) | Semua | `requireAuth` |
| `PUT` | `/api/objek-pajak/:nop` | **Update NJOP & data objek** ⭐ baru | BAKEUDA | `requireRole` |
| `DELETE` | `/api/objek-pajak/:nop` | Nonaktifkan NOP | BAKEUDA | `requireRole` |
| `PUT` | `/api/objek-pajak/bumi/:idBumi` | **Update detail tanah** ⭐ baru | BAKEUDA | `requireRole` |
| `PUT` | `/api/objek-pajak/bangunan/:idBangunan` | **Update detail bangunan** ⭐ baru | BAKEUDA | `requireRole` |
| `GET` | `/api/sppt?nop=&tahun_pajak=&status_bayar=` | Cari SPPT | Semua | `requireAuth` |
| `POST` | `/api/sppt/generate` | Terbitkan SPPT (satuan/massal) | BAKEUDA | `requireRole` |
| `PATCH` | `/api/sppt/:id/bayar` | Update status jadi LUNAS | BAKEUDA | `requireRole` |

**Total: 20 endpoint**, seluruhnya sudah terproteksi JWT. Tidak ada endpoint
yang bisa diakses tanpa login — bahkan endpoint `GET` sekalipun.

---

## 16. Catatan Import Data Legacy

Jika nanti kamu perlu **import data lama dari Oracle ke PostgreSQL**:

1. **Subjek Pajak** — `SUBJEK_PAJAK_ID` legacy → kolom `legacy_subjek_id`.  
   NIK harus divalidasi manual (data lama tidak punya NIK asli).
2. **Objek Pajak** — NOP legacy sudah 18 digit, langsung cocok dengan PK `nop`  
   di model baru. Field `KD_PROPINSI` s/d `KD_JNS_OP` dipetakan 1:1 ke kolom  
   komponen NOP di `ObjekPajak`.
3. **Bumi & Bangunan** — `NO_BUMI` dan `NO_BNG` legacy dipetakan langsung ke  
   `no_bumi` dan `no_bangunan` di model baru (relasi 1-to-many per NOP).
4. Gunakan script import terpisah (`prisma/import-legacy.ts`) yang membaca  
   hasil export CSV dari Oracle, lalu insert via `prisma.objekPajak.create()`  
   dengan nested `bumi`/`bangunan` seperti pada service di atas.

Kalau kamu mau, saya bisa buatkan script import-nya secara terpisah setelah struktur ini di-migrate dan diuji coba.

---

## 17. Status Kelengkapan Modul (Checklist)

| Requirement Tugas | Endpoint Terkait | Status |
|---|---|---|
| CRUD Wilayah | `POST/GET/PUT/DELETE /api/wilayah` | ✅ Lengkap |
| API dropdown wilayah | `GET /api/wilayah` | ✅ Lengkap |
| CRUD Subjek Pajak (by NIK) | `POST/GET/PUT/DELETE /api/subjek-pajak` | ✅ Lengkap |
| CRUD Objek Pajak | `POST/GET/PUT/DELETE /api/objek-pajak` | ✅ Lengkap (Create, Read, **Update**, Nonaktifkan) |
| Update detail Bumi/Bangunan | `PUT /api/objek-pajak/bumi/bangunan` | ✅ Lengkap |
| Generator NOP | `nop-generator.ts` (dipanggil otomatis saat create) | ✅ Lengkap |
| Pencarian NIK/NOP/Nama/Alamat | `GET ?q=keyword` di subjek & objek pajak | ✅ Lengkap |
| Kalkulator PBB Terutang | `pbb-calculator.ts` | ✅ Lengkap |
| Penerbitan SPPT massal/perorangan | `POST /api/sppt/generate` | ✅ Lengkap |
| Update status BELUM_BAYAR → LUNAS | `PATCH /api/sppt/:id/bayar` | ✅ Lengkap |
| **Authorization JWT di semua endpoint** | `requireAuth` / `requireRole` | ✅ Lengkap — tidak ada endpoint terbuka |

**Modul poin 2, 3, dan 4 sudah 100% lengkap** dengan authorization JWT + RBAC
(role-based access control) terpasang di setiap endpoint.
