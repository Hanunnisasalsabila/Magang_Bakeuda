/**
 * Seeder: Referensi DBKB (Daftar Biaya Komponen Bangunan)
 *         + Referensi Nilai Fasilitas
 *
 * Mengisi semua kombinasi kategori+kode dengan nilai_per_m2 = 0 (placeholder).
 * Nilai asli akan diisi manual oleh BAKEUDA atau via sinkronisasi Oracle nanti.
 *
 * Jalankan setelah prisma migrate/push:
 *   npx tsx src/scripts/seed-referensi-dbkb.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

const tahunBerlaku = new Date().getFullYear();

// ─────────────────────────────────────────
// Data DBKB — semua kategori klasifikasi bangunan
// ─────────────────────────────────────────

const dbkbPlaceholder = [
  // KONDISI_BANGUNAN (sesuai enum KondisiBangunan)
  { kategori: 'KONDISI_BANGUNAN', kode: 'SANGAT_BAIK', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'BAIK', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'SEDANG', nilai_per_m2: 0 },
  { kategori: 'KONDISI_BANGUNAN', kode: 'JELEK', nilai_per_m2: 0 },

  // JENIS_KONSTRUKSI (sesuai enum JenisKonstruksi)
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BAJA', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BETON', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'BATU_BATA', nilai_per_m2: 0 },
  { kategori: 'JENIS_KONSTRUKSI', kode: 'KAYU', nilai_per_m2: 0 },

  // JENIS_ATAP (sesuai enum JenisAtap)
  { kategori: 'JENIS_ATAP', kode: 'DECRABON_BETON_GLAZUR', nilai_per_m2: 0 },
  { kategori: 'JENIS_ATAP', kode: 'GENTENG_BETON_ALUMINIUM', nilai_per_m2: 0 },
  { kategori: 'JENIS_ATAP', kode: 'GENTENG_BIASA_SIRAP', nilai_per_m2: 0 },
  { kategori: 'JENIS_ATAP', kode: 'ASBES', nilai_per_m2: 0 },
  { kategori: 'JENIS_ATAP', kode: 'SENG', nilai_per_m2: 0 },

  // JENIS_DINDING (sesuai enum JenisDinding)
  { kategori: 'JENIS_DINDING', kode: 'KACA_ALUMINIUM', nilai_per_m2: 0 },
  { kategori: 'JENIS_DINDING', kode: 'BETON', nilai_per_m2: 0 },
  { kategori: 'JENIS_DINDING', kode: 'BATU_BATA_CONBLOK', nilai_per_m2: 0 },
  { kategori: 'JENIS_DINDING', kode: 'KAYU', nilai_per_m2: 0 },
  { kategori: 'JENIS_DINDING', kode: 'SENG', nilai_per_m2: 0 },
  { kategori: 'JENIS_DINDING', kode: 'TIDAK_ADA_DINDING', nilai_per_m2: 0 },

  // JENIS_LANTAI (sesuai enum JenisLantai)
  { kategori: 'JENIS_LANTAI', kode: 'MARMER', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANTAI', kode: 'KERAMIK', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANTAI', kode: 'TERASO', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANTAI', kode: 'UBIN_PC_PAPAN', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANTAI', kode: 'SEMEN', nilai_per_m2: 0 },

  // JENIS_LANGIT_LANGIT (sesuai enum JenisLangitLangit)
  { kategori: 'JENIS_LANGIT_LANGIT', kode: 'AKUSTIK_JATI', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANGIT_LANGIT', kode: 'TRIPLEK_ASBES_BAMBU', nilai_per_m2: 0 },
  { kategori: 'JENIS_LANGIT_LANGIT', kode: 'TIDAK_ADA', nilai_per_m2: 0 },

  // JENIS_PENGGUNAAN_BANGUNAN (sesuai 16 kode JPB dari referensi_jenis_penggunaan_bangunan)
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '01', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '02', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '03', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '04', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '05', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '06', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '07', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '08', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '09', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '10', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '11', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '12', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '13', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '14', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '15', nilai_per_m2: 0 },
  { kategori: 'JENIS_PENGGUNAAN_BANGUNAN', kode: '16', nilai_per_m2: 0 },
];

// ─────────────────────────────────────────
// Data Nilai Fasilitas — semua jenis fasilitas bangunan
// ─────────────────────────────────────────

const fasilitasPlaceholder = [
  { jenis_fasilitas: 'AC_SPLIT', nilai_tambah: 0 },
  { jenis_fasilitas: 'AC_WINDOW', nilai_tambah: 0 },
  { jenis_fasilitas: 'AC_SENTRAL', nilai_tambah: 0 },
  { jenis_fasilitas: 'KOLAM_RENANG_PER_M2', nilai_tambah: 0 },
  { jenis_fasilitas: 'PERKERASAN_RINGAN_PER_M2', nilai_tambah: 0 },
  { jenis_fasilitas: 'PERKERASAN_SEDANG_PER_M2', nilai_tambah: 0 },
  { jenis_fasilitas: 'PERKERASAN_BERAT_PER_M2', nilai_tambah: 0 },
  { jenis_fasilitas: 'PERKERASAN_DENGAN_PENUTUP_PER_M2', nilai_tambah: 0 },
  { jenis_fasilitas: 'LAPANGAN_TENIS_BETON', nilai_tambah: 0 },
  { jenis_fasilitas: 'LAPANGAN_TENIS_ASPAL', nilai_tambah: 0 },
  { jenis_fasilitas: 'LAPANGAN_TENIS_TANAH_RUMPUT', nilai_tambah: 0 },
  { jenis_fasilitas: 'LIFT_PENUMPANG', nilai_tambah: 0 },
  { jenis_fasilitas: 'LIFT_KAPSUL', nilai_tambah: 0 },
  { jenis_fasilitas: 'LIFT_BARANG', nilai_tambah: 0 },
  { jenis_fasilitas: 'TANGGA_BERJALAN', nilai_tambah: 0 },
  { jenis_fasilitas: 'PAGAR_PER_M', nilai_tambah: 0 },
  { jenis_fasilitas: 'HYDRANT', nilai_tambah: 0 },
  { jenis_fasilitas: 'SPRINKLER', nilai_tambah: 0 },
  { jenis_fasilitas: 'FIRE_ALARM', nilai_tambah: 0 },
  { jenis_fasilitas: 'SALURAN_PABX', nilai_tambah: 0 },
  { jenis_fasilitas: 'SUMUR_ARTESIS_PER_M', nilai_tambah: 0 },
];

async function main() {
  console.log(`🌱 Seeding referensi DBKB & nilai fasilitas (tahun ${tahunBerlaku})...`);

  // ── Seed DBKB ──
  let dbkbInserted = 0;
  let dbkbSkipped = 0;

  for (const item of dbkbPlaceholder) {
    const existing = await prisma.referensiDbkb.findUnique({
      where: {
        kategori_kode_tahun_berlaku: {
          kategori: item.kategori as any,
          kode: item.kode,
          tahun_berlaku: tahunBerlaku,
        },
      },
    });

    if (existing) {
      console.log(`  ⏭️  DBKB ${item.kategori}/${item.kode} sudah ada, dilewati`);
      dbkbSkipped++;
      continue;
    }

    await prisma.referensiDbkb.create({
      data: {
        kategori: item.kategori as any,
        kode: item.kode,
        nilai_per_m2: item.nilai_per_m2,
        tahun_berlaku: tahunBerlaku,
        sumber_data: 'MANUAL',
      },
    });
    console.log(`  ✅ DBKB ${item.kategori} — ${item.kode}`);
    dbkbInserted++;
  }

  // ── Seed Nilai Fasilitas ──
  let fasInserted = 0;
  let fasSkipped = 0;

  for (const item of fasilitasPlaceholder) {
    const existing = await prisma.referensiNilaiFasilitas.findUnique({
      where: {
        jenis_fasilitas_tahun_berlaku: {
          jenis_fasilitas: item.jenis_fasilitas as any,
          tahun_berlaku: tahunBerlaku,
        },
      },
    });

    if (existing) {
      console.log(`  ⏭️  Fasilitas ${item.jenis_fasilitas} sudah ada, dilewati`);
      fasSkipped++;
      continue;
    }

    await prisma.referensiNilaiFasilitas.create({
      data: {
        jenis_fasilitas: item.jenis_fasilitas as any,
        nilai_tambah: item.nilai_tambah,
        tahun_berlaku: tahunBerlaku,
        sumber_data: 'MANUAL',
      },
    });
    console.log(`  ✅ Fasilitas — ${item.jenis_fasilitas}`);
    fasInserted++;
  }

  console.log(`\n✨ Selesai:`);
  console.log(`   DBKB: ${dbkbInserted} ditambahkan, ${dbkbSkipped} dilewati`);
  console.log(`   Fasilitas: ${fasInserted} ditambahkan, ${fasSkipped} dilewati`);
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
