# Perbaikan — Integrasi Wilayah ke NOP & Akses Scoping per Desa

Lanjutan dari `perbaikan-subjek-objek-pajak-sesuai-spop.md`. Dokumen ini fokus ke 2 hal:
1. Menyambungkan `Wilayah` sebagai sumber tunggal (single source of truth) untuk komponen NOP
2. Membatasi akses role `DESA` hanya ke data di wilayahnya sendiri (row-level scoping)

---

## 1. Revisi `models/wilayah.prisma`

### Sebelum
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

### Sesudah

```prisma
model Wilayah {
  // kode_wilayah = gabungan propinsi+dati2+kecamatan+kelurahan (10 digit)
  // Ini PERSIS 10 digit pertama dari NOP 18 digit — jadi bisa langsung dipakai
  // sebagai prefix saat generate NOP, tanpa perlu susun ulang dari komponen terpisah.
  kode_wilayah String @id @db.VarChar(10)

  kode_propinsi String @db.VarChar(2)
  nama_propinsi String @db.VarChar(50) @default("Jawa Tengah")

  kode_dati2    String @db.VarChar(2)
  kabupaten     String @db.VarChar(100) @default("Purbalingga")

  kode_kecamatan String @db.VarChar(3)
  kecamatan      String @db.VarChar(100)

  kode_kelurahan String @db.VarChar(3)
  nama_desa      String @db.VarChar(100)

  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // ── Relasi ──
  users        User[]
  objek_pajak  ObjekPajak[]
  subjek_pajak SubjekPajak[]

  @@unique([kode_propinsi, kode_dati2, kode_kecamatan, kode_kelurahan])
  @@index([kode_kecamatan])
  @@map("wilayah")
}
```

**Kenapa dipecah jadi 4 kode terpisah** (`kode_propinsi`, `kode_dati2`, `kode_kecamatan`, `kode_kelurahan`) padahal `kode_wilayah` sudah gabungan semuanya?
- `nop-generator.ts` butuh masing-masing komponen dengan panjang presisi (2/2/3/3 digit) untuk disusun jadi NOP 18 digit.
- Dengan field terpisah, tidak perlu `substring()` manual dari `kode_wilayah` tiap kali generate NOP — tinggal ambil langsung dari row `Wilayah` yang sudah divalidasi ada.
- `nama_propinsi` dan `kabupaten` di-default ke `"Jawa Tengah"` dan `"Purbalingga"` karena scope sistem ini cuma 1 kabupaten — praktis tidak akan pernah berubah nilainya, tapi tetap disimpan eksplisit untuk keperluan tampilan/laporan.

### Seed Data

Karena cakupan cuma 1 kabupaten, siapkan seeder `src/scripts/seed-wilayah.ts` yang baca data resmi kecamatan+desa Kabupaten Purbalingga (dari Kemendagri/BPS, atau minta ke Bakeuda kalau sudah ada dari SISMIOP lama), lalu generate `kode_wilayah` otomatis dari gabungan 4 kode:

```typescript
const kodeWilayah =
  kode_propinsi.padStart(2, '0') +
  kode_dati2.padStart(2, '0') +
  kode_kecamatan.padStart(3, '0') +
  kode_kelurahan.padStart(3, '0');

await prisma.wilayah.upsert({
  where: { kode_wilayah: kodeWilayah },
  create: { kode_wilayah: kodeWilayah, kode_propinsi, kode_dati2, kode_kecamatan, kecamatan, kode_kelurahan, nama_desa },
  update: {},
});
```

---

## 2. Revisi `models/objek_pajak.prisma`

### Sebelum
```prisma
model ObjekPajak {
  nop String @id @db.VarChar(18)

  kode_propinsi  String @db.VarChar(2)
  kode_dati2     String @db.VarChar(2)
  kode_kecamatan String @db.VarChar(3)
  kode_kelurahan String @db.VarChar(3)
  kode_blok      String @db.VarChar(3)
  no_urut        String @db.VarChar(4)
  kode_jenis_op  String @db.VarChar(1)
  // ...
  @@unique([kode_propinsi, kode_dati2, kode_kecamatan, kode_kelurahan, kode_blok, no_urut, kode_jenis_op])
}
```

### Sesudah — ganti 4 field bebas jadi 1 relasi ke `Wilayah`

```prisma
model ObjekPajak {
  nop String @id @db.VarChar(18)

  kode_wilayah  String @db.VarChar(10)  // FK ke Wilayah — GANTI 4 field lama
  kode_blok     String @db.VarChar(3)
  no_urut       String @db.VarChar(4)
  kode_jenis_op String @db.VarChar(1)

  nik_subjek   String     @db.VarChar(16)
  no_persil    String?    @db.VarChar(20)
  jalan_op     String     @db.VarChar(255)
  blok_kav_no  String?    @db.VarChar(50)
  rw_op        String?    @db.VarChar(5)
  rt_op        String?    @db.VarChar(5)
  jenis_tanah  JenisTanah

  luas_tanah      Decimal  @default(0) @db.Decimal(10, 2)
  luas_bangunan   Decimal  @default(0) @db.Decimal(10, 2)
  jumlah_bangunan Int      @default(0)
  njop_tanah      Decimal? @db.Decimal(15, 2)
  njop_bangunan   Decimal? @db.Decimal(15, 2)
  njop_total      Decimal? @db.Decimal(15, 2)
  tahun_penilaian Int?

  status_aktif  Boolean   @default(true)
  nonaktif_oleh String?
  nonaktif_at   DateTime?
  created_at    DateTime  @default(now())

  // ── Relasi ──
  wilayah       Wilayah               @relation(fields: [kode_wilayah], references: [kode_wilayah])
  subjek_pajak  SubjekPajak           @relation(fields: [nik_subjek], references: [nik])
  user_nonaktif User?                 @relation("NonaktifOlehUser", fields: [nonaktif_oleh], references: [id_user])
  transaksi     TransaksiSpop[]       @relation("ObjekBersama")
  detail_asal   DetailTransaksiAsal[]
  sppt          Sppt[]
  bumi          ObjekBumi[]
  bangunan      ObjekBangunan[]

  @@unique([kode_wilayah, kode_blok, no_urut, kode_jenis_op])
  @@index([nik_subjek])
  @@index([kode_wilayah])
  @@map("objek_pajak")
}
```

**Field yang dihapus:** `kode_propinsi`, `kode_dati2`, `kode_kecamatan`, `kode_kelurahan`, `kelurahan_op`, `kecamatan_op` — semuanya sekarang didapat dari **join ke `Wilayah`** lewat `kode_wilayah`, tidak perlu disimpan berulang (denormalisasi) di `ObjekPajak`. Kalau butuh nama kelurahan/kecamatan untuk tampilan, tinggal `include: { wilayah: true }`.

> ⚠️ **Field `jalan_op`, `blok_kav_no`, `rw_op`, `rt_op`, `no_persil` tetap dipertahankan** karena itu alamat spesifik objek (bukan data wilayah administratif), sesuai form field 19-24.

---

## 3. Revisi `models/subjek_pajak.prisma`

Alamat `SubjekPajak` juga sebaiknya ikut pola yang sama, supaya bisa di-scope per wilayah juga (subjek pajak yang tinggal di desa X, idealnya juga tervalidasi terhadap tabel `Wilayah`):

### Sebelum
```prisma
kelurahan  String  @db.VarChar(100)
kecamatan  String? @db.VarChar(100)
kabupaten  String  @db.VarChar(100)
```

### Sesudah
```prisma
kode_wilayah String @db.VarChar(10)  // FK ke Wilayah — ganti kelurahan/kecamatan/kabupaten bebas

// ── Relasi ──
wilayah Wilayah @relation(fields: [kode_wilayah], references: [kode_wilayah])
```

> Field `kode_pos`, `alamat_jalan`, `blok_kav_no_subjek`, `rw`, `rt` tetap dipertahankan (alamat spesifik, bukan data administratif wilayah).

---

## 4. Revisi `nop-generator.ts` — Lookup dari `Wilayah`, Bukan Input Bebas

### Sebelum
```typescript
async generateNop(input: GenerateNopInput): Promise<string> {
  const { kode_propinsi, kode_dati2, kode_kecamatan, kode_kelurahan, kode_blok, kode_jenis_op } = input;
  // cari no_urut dari 5 field bebas...
}
```

### Sesudah

```typescript
export interface GenerateNopInput {
  kode_wilayah: string;   // WAJIB sudah tervalidasi ada di tabel Wilayah
  kode_blok: string;
  kode_jenis_op: string;
}

@Injectable()
export class NopGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateNop(
    input: GenerateNopInput,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<string> {
    const { kode_wilayah, kode_blok, kode_jenis_op } = input;

    // Validasi wilayah benar-benar ada — mencegah NOP dengan kode wilayah palsu
    const wilayah = await tx.wilayah.findUnique({ where: { kode_wilayah } });
    if (!wilayah) throw new BadRequestException('Kode wilayah tidak valid/tidak terdaftar');

    // Cari nomor urut terakhir di blok yang sama, dalam wilayah yang sama
    const lastObjek = await tx.objekPajak.findFirst({
      where: { kode_wilayah, kode_blok },
      orderBy: { no_urut: 'desc' },
    });

    const nextUrut = lastObjek ? parseInt(lastObjek.no_urut, 10) + 1 : 1;
    const noUrutStr = nextUrut.toString().padStart(4, '0');

    // kode_wilayah SUDAH 10 digit (propinsi+dati2+kecamatan+kelurahan) — tinggal sambung
    return kode_wilayah + kode_blok.padStart(3, '0') + noUrutStr + kode_jenis_op;
  }

  parseNop(nop: string) {
    if (nop.length !== 18) throw new Error('NOP harus 18 digit');
    return {
      kode_wilayah: nop.substring(0, 10),
      kode_blok: nop.substring(10, 13),
      no_urut: nop.substring(13, 17),
      kode_jenis_op: nop.substring(17, 18),
    };
  }
}
```

**Manfaat langsung:**
- **Tidak bisa lagi generate NOP dengan kombinasi wilayah yang tidak ada** — kalau `kode_wilayah` yang dikirim tidak ketemu di tabel `Wilayah`, langsung ditolak `BadRequestException`, bukan lolos jadi NOP "hantu".
- **User cukup pilih 1 dropdown desa** (`kode_wilayah`) di frontend, bukan isi 4 field kode terpisah manual.

---

## 5. Revisi `ObjekPajakService.create()`

```typescript
async create(dto: CreateObjekPajakDto, currentUser: { id_user: string; role: string; kode_wilayah: string | null }) {
  // Petugas DESA hanya boleh create objek pajak di wilayahnya sendiri
  const kodeWilayah = this.resolveWilayahForCreate(dto.kode_wilayah, currentUser);

  const subjek = await this.prisma.subjekPajak.findUnique({ where: { nik: dto.nik_subjek } });
  if (!subjek) throw new BadRequestException('Subjek pajak (NIK) tidak ditemukan');

  const objek = await this.prisma.$transaction(async (tx) => {
    const nop = await this.nopGenerator.generateNop(
      { kode_wilayah: kodeWilayah, kode_blok: dto.kode_blok, kode_jenis_op: dto.kode_jenis_op },
      tx,
    );

    return tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: dto.kode_blok,
        no_urut: nop.substring(13, 17),
        kode_jenis_op: dto.kode_jenis_op,
        nik_subjek: dto.nik_subjek,
        no_persil: dto.no_persil,
        jalan_op: dto.jalan_op,
        blok_kav_no: dto.blok_kav_no,
        rw_op: dto.rw_op,
        rt_op: dto.rt_op,
        jenis_tanah: dto.jenis_tanah,
        // ...bumi, bangunan sama seperti sebelumnya...
      },
      include: { bumi: true, bangunan: { include: { fasilitas: true } }, wilayah: true },
    });
  }, { isolationLevel: 'Serializable' });

  return { success: true, message: 'Objek pajak berhasil ditambahkan', data: objek };
}

// Helper: petugas DESA dipaksa pakai wilayahnya sendiri, tidak boleh pilih wilayah lain
private resolveWilayahForCreate(dtoKodeWilayah: string | undefined, currentUser: { role: string; kode_wilayah: string | null }) {
  if (currentUser.role === 'DESA') {
    if (!currentUser.kode_wilayah) {
      throw new BadRequestException('User DESA belum terikat ke wilayah manapun — hubungi BAKEUDA');
    }
    return currentUser.kode_wilayah; // abaikan input dto, paksa pakai wilayah sendiri
  }
  // BAKEUDA boleh pilih wilayah manapun
  if (!dtoKodeWilayah) throw new BadRequestException('kode_wilayah wajib diisi');
  return dtoKodeWilayah;
}
```

---

## 6. Row-Level Scoping — Batasi DESA Hanya Lihat Wilayahnya Sendiri

### 6.1 Buat Helper Terpusat

Buat `src/common/wilayah-scope.helper.ts` supaya logika ini tidak diulang-ulang di tiap service:

```typescript
import { ForbiddenException } from '@nestjs/common';

export interface CurrentUser {
  id_user: string;
  role: 'DESA' | 'BAKEUDA';
  kode_wilayah: string | null;
}

/** Bangun filter `where` tambahan berdasarkan role user */
export function buildWilayahScope(user: CurrentUser): { kode_wilayah?: string } {
  if (user.role === 'BAKEUDA') return {}; // tidak ada batasan
  if (!user.kode_wilayah) {
    throw new ForbiddenException('User DESA belum terikat ke wilayah manapun');
  }
  return { kode_wilayah: user.kode_wilayah };
}

/** Cek apakah user boleh akses 1 record spesifik berdasarkan kode_wilayah record itu */
export function assertWilayahAccess(user: CurrentUser, recordKodeWilayah: string) {
  if (user.role === 'BAKEUDA') return;
  if (user.kode_wilayah !== recordKodeWilayah) {
    throw new ForbiddenException('Anda tidak memiliki akses ke data wilayah ini');
  }
}
```

### 6.2 Terapkan di `ObjekPajakService`

```typescript
async search(keyword: string, currentUser: CurrentUser) {
  const scope = buildWilayahScope(currentUser);

  const results = await this.prisma.objekPajak.findMany({
    where: {
      ...scope, // ← otomatis nempel kode_wilayah kalau DESA, kosong kalau BAKEUDA
      OR: [
        { nop: { contains: keyword } },
        { jalan_op: { contains: keyword, mode: 'insensitive' } },
        { subjek_pajak: { nama_subjek: { contains: keyword, mode: 'insensitive' } } },
      ],
    },
    include: { subjek_pajak: { select: { nama_subjek: true } }, wilayah: true },
    take: 50,
  });
  return { success: true, total: results.length, data: results };
}

async getByNop(nop: string, currentUser: CurrentUser) {
  const objek = await this.prisma.objekPajak.findUnique({
    where: { nop },
    include: { subjek_pajak: true, bumi: true, bangunan: { include: { fasilitas: true } }, wilayah: true },
  });
  if (!objek) throw new NotFoundException('Objek pajak tidak ditemukan');

  assertWilayahAccess(currentUser, objek.kode_wilayah); // ← cek akses per-record

  return { success: true, data: objek };
}

async update(nop: string, dto: UpdateObjekPajakDto, currentUser: CurrentUser) {
  const existing = await this.prisma.objekPajak.findUnique({ where: { nop } });
  if (!existing) throw new NotFoundException('Objek pajak tidak ditemukan');

  assertWilayahAccess(currentUser, existing.kode_wilayah); // ← cek sebelum update

  // ...sisanya sama seperti sebelumnya
}
```

Terapkan pola yang sama (`buildWilayahScope` di method list/search, `assertWilayahAccess` di method detail/update/delete) ke:
- `SubjekPajakService` (`search`, `getByNik`, `update`, `delete`)
- Modul SPPT nanti kalau ada `search`/`getByX`

### 6.3 Controller — Ambil `currentUser` dari JWT, Kirim ke Service

```typescript
@Get()
async search(@Query('q') keyword: string, @Request() req: any) {
  return this.objekPajakService.search(keyword ?? '', req.user);
}

@Get(':nop')
async getByNop(@Param('nop') nop: string, @Request() req: any) {
  return this.objekPajakService.getByNop(nop, req.user);
}
```

> Pastikan `JwtAuthGuard`/`JwtStrategy` kamu memasukkan `kode_wilayah` ke payload token saat login, supaya `req.user.kode_wilayah` tersedia tanpa query database tambahan tiap request. Cek `auth.service.ts` bagian `login()` — kalau payload JWT sekarang cuma `{ id_user, username, role }`, perlu ditambah `kode_wilayah`.

---

## 7. Checklist Testing Tambahan

- [ ] Login sebagai DESA wilayah A → `GET /objek-pajak` → hasil **hanya** objek pajak wilayah A
- [ ] Login sebagai DESA wilayah A → `GET /objek-pajak/:nop` milik wilayah B → **403 Forbidden**
- [ ] Login sebagai DESA wilayah A → `POST /objek-pajak` dengan `kode_wilayah` wilayah B di body → tetap tersimpan sebagai wilayah A (diabaikan, dipaksa pakai wilayah sendiri)
- [ ] Login sebagai BAKEUDA → `GET /objek-pajak` → hasil **semua wilayah**, tidak difilter
- [ ] User `DESA` yang `kode_wilayah`-nya `null` (belum di-assign wilayah) → **403** dengan pesan jelas, bukan crash
- [ ] `POST /objek-pajak` dengan `kode_wilayah` yang tidak ada di tabel `Wilayah` → **400 Bad Request**

---

## 8. Urutan Migrasi (Data Existing)

Karena `ObjekPajak` dan `SubjekPajak` ganti dari 4-5 field bebas jadi 1 FK `kode_wilayah`, kalau sudah ada data live:

1. Backup database.
2. Seed tabel `Wilayah` dulu (section 1) — pastikan semua kombinasi propinsi+dati2+kecamatan+kelurahan yang **sudah dipakai** di data `ObjekPajak`/`SubjekPajak` existing, ada representasinya di `Wilayah`.
3. Tulis migration script SQL manual: `UPDATE objek_pajak SET kode_wilayah = kode_propinsi || kode_dati2 || kode_kecamatan || kode_kelurahan` **sebelum** kolom lama di-drop.
4. Baru jalankan `prisma migrate dev` untuk drop kolom lama & tambah constraint FK.
