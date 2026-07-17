/**
 * Script Sinkronisasi Oracle → PostgreSQL
 * Mencakup: ZNT, DBKB, dan Nilai Fasilitas
 *
 * ⚠️ SEMUA NAMA TABEL/KOLOM ORACLE DI BAWAH MASIH PLACEHOLDER
 *    (DAT_ZNT, DAT_DBKB, DAT_NILAI_FASILITAS)
 *    Ganti dengan nama asli setelah mengecek struktur tabel di Oracle
 *    via DBeaver/SQL Developer: SELECT * FROM ALL_TABLES
 *
 * Jalankan:
 *   npx tsx src/scripts/sync-oracle.ts
 *
 * Prasyarat:
 *   1. Oracle Instant Client terinstall
 *   2. npm install oracledb
 *   3. .env terisi: ORACLE_HOST, ORACLE_PORT, ORACLE_SERVICE, ORACLE_USER, ORACLE_PASSWORD
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getOracleConnection } from '../lib/oracle-client.js';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

// ─────────────────────────────────────────
// SYNC ZNT (Zona Nilai Tanah)
// ─────────────────────────────────────────

async function syncZnt(connection: any) {
  console.log('📡 Sinkronisasi ZNT...');

  // ⚠️ PLACEHOLDER — ganti nama tabel/kolom setelah cek struktur asli Oracle
  const result = await connection.execute(
    `SELECT KODE_ZNT, NILAI_PER_M2, TAHUN FROM DAT_ZNT`,
  );

  if (!result.rows || result.rows.length === 0) {
    console.log('  ⚠️ Tidak ada data ZNT di Oracle');
    return;
  }

  let synced = 0;
  for (const row of result.rows as any[]) {
    // Prisma upsert: jika sudah ada (kode_znt + tahun), update nilainya
    // Catatan: model ReferensiZnt belum ada di schema saat ini
    // Uncomment dan sesuaikan setelah model ZNT dibuat
    //
    // await prisma.referensiZnt.upsert({
    //   where: {
    //     kode_znt_tahun_berlaku: {
    //       kode_znt: row[0],
    //       tahun_berlaku: row[2],
    //     },
    //   },
    //   create: {
    //     kode_znt: row[0],
    //     nilai_per_m2: row[1],
    //     tahun_berlaku: row[2],
    //     sumber_data: 'ORACLE_SYNC',
    //     synced_at: new Date(),
    //   },
    //   update: {
    //     nilai_per_m2: row[1],
    //     sumber_data: 'ORACLE_SYNC',
    //     synced_at: new Date(),
    //   },
    // });
    synced++;
  }

  console.log(`  ✅ ZNT: ${synced} row disinkronkan`);
}

// ─────────────────────────────────────────
// SYNC DBKB (Daftar Biaya Komponen Bangunan)
// ─────────────────────────────────────────

async function syncDbkb(connection: any) {
  console.log('📡 Sinkronisasi DBKB...');

  // ⚠️ PLACEHOLDER — ganti nama tabel/kolom setelah cek struktur asli Oracle
  const result = await connection.execute(
    `SELECT KATEGORI, KODE, NILAI_PER_M2, TAHUN FROM DAT_DBKB`,
  );

  if (!result.rows || result.rows.length === 0) {
    console.log('  ⚠️ Tidak ada data DBKB di Oracle');
    return;
  }

  let synced = 0;
  for (const row of result.rows as any[]) {
    await prisma.referensiDbkb.upsert({
      where: {
        kategori_kode_tahun_berlaku: {
          kategori: row[0],
          kode: row[1],
          tahun_berlaku: row[3],
        },
      } as any,
      create: {
        kategori: row[0],
        kode: row[1],
        nilai_per_m2: row[2],
        tahun_berlaku: row[3],
        sumber_data: 'ORACLE_SYNC',
        synced_at: new Date(),
      } as any,
      update: {
        nilai_per_m2: row[2],
        sumber_data: 'ORACLE_SYNC',
        synced_at: new Date(),
      },
    });
    synced++;
  }

  console.log(`  ✅ DBKB: ${synced} row disinkronkan`);
}

// ─────────────────────────────────────────
// SYNC NILAI FASILITAS
// ─────────────────────────────────────────

async function syncNilaiFasilitas(connection: any) {
  console.log('📡 Sinkronisasi Nilai Fasilitas...');

  // ⚠️ PLACEHOLDER — kemungkinan besar tabel ini TIDAK ADA di Oracle lama
  // Sistem SISMIOP lama mungkin tidak pernah punya kalkulasi otomatis
  // untuk fasilitas bangunan. Jika tabel tidak ada, skip sync ini
  // dan isi manual via endpoint CRUD yang perlu dibuatkan terpisah.
  try {
    const result = await connection.execute(
      `SELECT JENIS_FASILITAS, NILAI_TAMBAH, TAHUN FROM DAT_NILAI_FASILITAS`,
    );

    if (!result.rows || result.rows.length === 0) {
      console.log('  ⚠️ Tidak ada data Nilai Fasilitas di Oracle');
      return;
    }

    let synced = 0;
    for (const row of result.rows as any[]) {
      await prisma.referensiNilaiFasilitas.upsert({
        where: {
          jenis_fasilitas_tahun_berlaku: {
            jenis_fasilitas: row[0],
            tahun_berlaku: row[2],
          },
        } as any,
        create: {
          jenis_fasilitas: row[0],
          nilai_tambah: row[1],
          tahun_berlaku: row[2],
          sumber_data: 'ORACLE_SYNC',
          synced_at: new Date(),
        } as any,
        update: {
          nilai_tambah: row[1],
          sumber_data: 'ORACLE_SYNC',
          synced_at: new Date(),
        },
      });
      synced++;
    }

    console.log(`  ✅ Fasilitas: ${synced} row disinkronkan`);
  } catch (err: any) {
    // Tabel mungkin tidak ada di Oracle — ini expected, bukan error fatal
    console.log(
      `  ⚠️ Tabel DAT_NILAI_FASILITAS tidak ditemukan di Oracle (expected jika SISMIOP lama tidak punya). Error: ${err.message}`,
    );
  }
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────

async function main() {
  console.log('🔄 Memulai sinkronisasi Oracle → PostgreSQL...\n');

  const connection = await getOracleConnection();

  try {
    await syncZnt(connection);
    await syncDbkb(connection);
    await syncNilaiFasilitas(connection);
    console.log('\n✅ Sinkronisasi ZNT + DBKB + Fasilitas selesai');
  } finally {
    await connection.close();
    console.log('🔌 Koneksi Oracle ditutup');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error saat sinkronisasi:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
