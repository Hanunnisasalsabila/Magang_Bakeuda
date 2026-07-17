# Perbaikan — Konversi Field Klasifikasi Bangunan ke Enum

Lanjutan dari `perbaikan-subjek-objek-pajak-sesuai-spop.md` dan `perbaikan-wilayah-nop-scoping.md`. Dokumen ini fokus mengganti 7 field klasifikasi teknis bangunan di `ObjekBangunan` dan `ObjekBangunanFasilitas` — dari `String @db.VarChar(1)` bebas jadi `enum` Prisma, sesuai opsi baku di Lampiran SPOP bagian A & B.

**Keputusan desain:** pakai `enum`, **bukan** tabel referensi terpisah — karena ke-7 kategori ini bersifat baku dari standar penilaian PBB (fisik bangunan), bukan master data administratif yang realistis bertambah/berubah. Beda konteks dari `ReferensiJenisPenggunaanBangunan` (JPB) yang tetap pakai tabel referensi karena kategorinya bisa berkembang.

---

## 0. Ringkasan Field yang Diubah

| Field | Model | Jumlah Opsi | Enum Baru |
|---|---|---|---|
| `kondisi_bangunan` | `ObjekBangunan` | 4 | `KondisiBangunan` |
| `jenis_konstruksi` | `ObjekBangunan` | 4 | `JenisKonstruksi` |
| `jenis_atap` | `ObjekBangunan` | 5 | `JenisAtap` |
| `kode_dinding` | `ObjekBangunan` | 6 | `JenisDinding` |
| `kode_lantai` | `ObjekBangunan` | 5 | `JenisLantai` |
| `kode_langit_langit` | `ObjekBangunan` | 3 | `JenisLangitLangit` |
| `bahan_pagar` | `ObjekBangunanFasilitas` | 2 | `BahanPagar` |

Field `Boolean` yang **sudah benar dan tidak diubah**: `ac_sentral`, `hydrant_ada`, `sprinkler_ada`, `fire_alarm_ada`.

---

## 1. Tambahkan Enum Baru di `models/objek_pajak.prisma`

Tambahkan di bagian atas file, bersebelahan dengan `enum JenisTanah` yang sudah ada:

```prisma
enum KondisiBangunan {
  SANGAT_BAIK // 1. Sangat Baik
  BAIK        // 2. Baik
  SEDANG      // 3. Sedang
  JELEK       // 4. Jelek
}

enum JenisKonstruksi {
  BAJA      // 1. Baja
  BETON     // 2. Beton
  BATU_BATA // 3. Batu Bata
  KAYU      // 4. Kayu
}

enum JenisAtap {
  DECRABON_BETON_GLAZUR // 1. Decrabon/Beton/Gtg Glazur
  GENTENG_BETON_ALUMINIUM // 2. Gtg Beton/Aluminium
  GENTENG_BIASA_SIRAP     // 3. Gtg Biasa/Sirap
  ASBES                   // 4. Asbes
  SENG                    // 5. Seng
}

enum JenisDinding {
  KACA_ALUMINIUM // 1. Kaca/Aluminium
  BETON          // 2. Beton
  BATU_BATA_CONBLOK // 3. Batu Bata/Conblok
  KAYU              // 4. Kayu
  SENG              // 5. Seng
  TIDAK_ADA_DINDING // 6. Tidak Ada Dinding
}

enum JenisLantai {
  MARMER      // 1. Marmer
  KERAMIK     // 2. Keramik
  TERASO      // 3. Teraso
  UBIN_PC_PAPAN // 4. Ubin PC/Papan
  SEMEN         // 5. Semen
}

enum JenisLangitLangit {
  AKUSTIK_JATI      // 1. Akustik/Jati
  TRIPLEK_ASBES_BAMBU // 2. Triplek/Asbes/Bambu
  TIDAK_ADA           // 3. Tidak Ada
}

enum BahanPagar {
  BAJA_BESI    // 1. Baja/Besi
  BATA_BATAKO  // 2. Bata/Batako
}
```

> Penamaan value enum di Prisma **tidak boleh diawali angka** dan sebaiknya deskriptif (bukan cuma `SATU`, `DUA`), supaya kode tetap terbaca jelas tanpa perlu buka form fisik tiap kali baca schema.

---

## 2. Ubah Tipe Field di Model `ObjekBangunan`

### Sebelum
```prisma
model ObjekBangunan {
  // ...
  kondisi_bangunan   String? @db.VarChar(1)
  jenis_konstruksi   String? @db.VarChar(1)
  jenis_atap         String? @db.VarChar(1)
  kode_dinding       String? @db.VarChar(1)
  kode_lantai        String? @db.VarChar(1)
  kode_langit_langit String? @db.VarChar(1)
  // ...
}
```

### Sesudah
```prisma
model ObjekBangunan {
  // ...
  kondisi_bangunan   KondisiBangunan?
  jenis_konstruksi   JenisKonstruksi?
  jenis_atap         JenisAtap?
  kode_dinding       JenisDinding?
  kode_lantai        JenisLantai?
  kode_langit_langit JenisLangitLangit?
  // ...
}
```

Tanda `?` (opsional) dipertahankan — field-field ini tetap boleh kosong saat pendataan awal belum lengkap, sama seperti desain aslinya.

---

## 3. Ubah Tipe Field di Model `ObjekBangunanFasilitas`

### Sebelum
```prisma
model ObjekBangunanFasilitas {
  // ...
  panjang_pagar_m Decimal @default(0) @db.Decimal(10, 2)
  bahan_pagar     String? @db.VarChar(1) // 1=Baja/Besi, 2=Bata/Batako
  // ...
}
```

### Sesudah
```prisma
model ObjekBangunanFasilitas {
  // ...
  panjang_pagar_m Decimal     @default(0) @db.Decimal(10, 2)
  bahan_pagar     BahanPagar?
  // ...
}
```

---

## 4. Update DTO

### 4.1 `dto/create-objek-pajak.dto.ts` — bagian `ObjekBangunanDto`

**Sebelum:**
```typescript
class ObjekBangunanDto {
  // ...
  @IsOptional() @IsString() kondisi_bangunan?: string;
  @IsOptional() @IsString() jenis_konstruksi?: string;
  @IsOptional() @IsString() jenis_atap?: string;
  @IsOptional() @IsString() kode_dinding?: string;
  @IsOptional() @IsString() kode_lantai?: string;
  @IsOptional() @IsString() kode_langit_langit?: string;
}
```

**Sesudah:**
```typescript
import {
  KondisiBangunan,
  JenisKonstruksi,
  JenisAtap,
  JenisDinding,
  JenisLantai,
  JenisLangitLangit,
} from '@prisma/client';

class ObjekBangunanDto {
  // ...
  @IsOptional() @IsEnum(KondisiBangunan) kondisi_bangunan?: KondisiBangunan;
  @IsOptional() @IsEnum(JenisKonstruksi) jenis_konstruksi?: JenisKonstruksi;
  @IsOptional() @IsEnum(JenisAtap) jenis_atap?: JenisAtap;
  @IsOptional() @IsEnum(JenisDinding) kode_dinding?: JenisDinding;
  @IsOptional() @IsEnum(JenisLantai) kode_lantai?: JenisLantai;
  @IsOptional() @IsEnum(JenisLangitLangit) kode_langit_langit?: JenisLangitLangit;
}
```

### 4.2 `dto/create-objek-pajak.dto.ts` — bagian `FasilitasBangunanDto`

**Sebelum:**
```typescript
@IsOptional() @IsString() bahan_pagar?: string;
```

**Sesudah:**
```typescript
import { BahanPagar } from '@prisma/client';

@IsOptional() @IsEnum(BahanPagar) bahan_pagar?: BahanPagar;
```

### 4.3 `dto/update-objek-bangunan.dto.ts` & `dto/update-fasilitas-bangunan.dto.ts`

Kalau memakai pola `PartialType(CreateXxxDto)`, perubahan di section 4.1-4.2 otomatis ikut terbawa — tinggal dicek ulang tidak ada override manual field ini di file update DTO-nya.

---

## 5. Endpoint Metadata Baru (Opsional, Direkomendasikan)

Supaya frontend punya 1 sumber kebenaran untuk isi dropdown (label Bahasa Indonesia yang konsisten dengan backend), tambahkan endpoint kecil ini.

### 5.1 Buat `src/objek-pajak/objek-pajak-meta.constants.ts`

```typescript
export const KLASIFIKASI_BANGUNAN_META = {
  kondisi_bangunan: [
    { value: 'SANGAT_BAIK', label: 'Sangat Baik' },
    { value: 'BAIK', label: 'Baik' },
    { value: 'SEDANG', label: 'Sedang' },
    { value: 'JELEK', label: 'Jelek' },
  ],
  jenis_konstruksi: [
    { value: 'BAJA', label: 'Baja' },
    { value: 'BETON', label: 'Beton' },
    { value: 'BATU_BATA', label: 'Batu Bata' },
    { value: 'KAYU', label: 'Kayu' },
  ],
  jenis_atap: [
    { value: 'DECRABON_BETON_GLAZUR', label: 'Decrabon/Beton/Gtg Glazur' },
    { value: 'GENTENG_BETON_ALUMINIUM', label: 'Genteng Beton/Aluminium' },
    { value: 'GENTENG_BIASA_SIRAP', label: 'Genteng Biasa/Sirap' },
    { value: 'ASBES', label: 'Asbes' },
    { value: 'SENG', label: 'Seng' },
  ],
  kode_dinding: [
    { value: 'KACA_ALUMINIUM', label: 'Kaca/Aluminium' },
    { value: 'BETON', label: 'Beton' },
    { value: 'BATU_BATA_CONBLOK', label: 'Batu Bata/Conblok' },
    { value: 'KAYU', label: 'Kayu' },
    { value: 'SENG', label: 'Seng' },
    { value: 'TIDAK_ADA_DINDING', label: 'Tidak Ada Dinding' },
  ],
  kode_lantai: [
    { value: 'MARMER', label: 'Marmer' },
    { value: 'KERAMIK', label: 'Keramik' },
    { value: 'TERASO', label: 'Teraso' },
    { value: 'UBIN_PC_PAPAN', label: 'Ubin PC/Papan' },
    { value: 'SEMEN', label: 'Semen' },
  ],
  kode_langit_langit: [
    { value: 'AKUSTIK_JATI', label: 'Akustik/Jati' },
    { value: 'TRIPLEK_ASBES_BAMBU', label: 'Triplek/Asbes/Bambu' },
    { value: 'TIDAK_ADA', label: 'Tidak Ada' },
  ],
  bahan_pagar: [
    { value: 'BAJA_BESI', label: 'Baja/Besi' },
    { value: 'BATA_BATAKO', label: 'Bata/Batako' },
  ],
};
```

### 5.2 Tambahkan Endpoint di `ObjekPajakController`

```typescript
import { KLASIFIKASI_BANGUNAN_META } from './objek-pajak-meta.constants.js';

// GET /objek-pajak/meta/enums
@Get('meta/enums')
async getEnumMeta() {
  return { success: true, data: KLASIFIKASI_BANGUNAN_META };
}
```

> ⚠️ **Letakkan route ini SEBELUM route `@Get(':nop')`** di controller (urutan deklarasi penting di NestJS) — kalau tidak, request ke `/objek-pajak/meta/enums` akan ketangkep sebagai `:nop = "meta"` oleh route yang salah, lalu gagal karena bukan NOP 18 digit valid.

---

## 6. Migrasi Data Existing

Kalau sudah ada data live dengan field lama berisi kode 1 karakter (`"1"`, `"2"`, dst):

1. Backup database.
2. Petakan kode lama ke value enum baru, contoh untuk `kondisi_bangunan`:
   ```sql
   UPDATE objek_bangunan SET kondisi_bangunan =
     CASE kondisi_bangunan
       WHEN '1' THEN 'SANGAT_BAIK'
       WHEN '2' THEN 'BAIK'
       WHEN '3' THEN 'SEDANG'
       WHEN '4' THEN 'JELEK'
       ELSE NULL
     END;
   ```
   Ulangi query serupa untuk `jenis_konstruksi`, `jenis_atap`, `kode_dinding`, `kode_lantai`, `kode_langit_langit`, dan `bahan_pagar` (di tabel `objek_bangunan_fasilitas`) — sesuaikan urutan `CASE` dengan urutan opsi di form.
3. Jalankan migrasi SQL manual ini **sebelum** `prisma migrate dev` mengubah tipe kolom ke enum — supaya tidak ada row gagal constraint saat kolom berubah tipe.
4. Baru jalankan `npx prisma migrate dev --name konversi_klasifikasi_bangunan_ke_enum`.

---

## 7. Checklist Testing

- [ ] `POST /objek-pajak` dengan `kondisi_bangunan: "BAIK"` → `201`
- [ ] `POST /objek-pajak` dengan `kondisi_bangunan: "9"` (kode lama/tidak valid) → `400 Bad Request`
- [ ] `POST /objek-pajak` dengan `jenis_atap: "SENG"` → `201`
- [ ] `POST /objek-pajak` dengan `bahan_pagar: "BAJA_BESI"` (nested di `fasilitas`) → `201`
- [ ] `GET /objek-pajak/meta/enums` → `200`, response berisi 7 kategori lengkap dengan label
- [ ] `GET /objek-pajak/meta/enums` dipanggil **sebelum** route `:nop` di controller — pastikan tidak ke-intercept jadi "NOP tidak ditemukan"
- [ ] Cek `npx prisma studio` — kolom di database sekarang bertipe enum Postgres, bukan lagi `varchar(1)`

---

## 8. Urutan Eksekusi

1. Tambahkan 7 enum baru ke `models/objek_pajak.prisma` (section 1)
2. Ubah tipe field di `ObjekBangunan` dan `ObjekBangunanFasilitas` (section 2, 3)
3. Migrasi data existing kalau ada (section 6) — **lakukan sebelum langkah 4**
4. Jalankan `npx prisma migrate dev --name konversi_klasifikasi_bangunan_ke_enum`
5. Update DTO (section 4)
6. Buat file constants + endpoint metadata (section 5) — opsional tapi direkomendasikan
7. Jalankan checklist testing (section 7)
8. Update Postman collection: tambahkan request `GET /objek-pajak/meta/enums`, dan ubah body contoh `POST /objek-pajak` yang sebelumnya pakai kode `"1"`/`"2"` jadi value enum baru
