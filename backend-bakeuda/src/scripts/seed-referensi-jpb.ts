/**
 * Seeder: Referensi Jenis Penggunaan Bangunan (JPB)
 * 16 kode baku sesuai Lampiran SPOP field 5
 *
 * Jalankan setelah prisma migrate dev:
 *   npx tsx src/scripts/seed-referensi-jpb.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

const DATA_JPB = [
  { kode_jpb: '01', nama_jpb: 'Perumahan', urutan: 1 },
  { kode_jpb: '02', nama_jpb: 'Perkantoran Swasta', urutan: 2 },
  { kode_jpb: '03', nama_jpb: 'Pabrik', urutan: 3 },
  { kode_jpb: '04', nama_jpb: 'Toko/Apotik/Pasar/Ruko', urutan: 4 },
  { kode_jpb: '05', nama_jpb: 'Rumah Sakit/Klinik', urutan: 5 },
  { kode_jpb: '06', nama_jpb: 'Olah Raga/Rekreasi', urutan: 6 },
  { kode_jpb: '07', nama_jpb: 'Hotel/Wisma', urutan: 7 },
  { kode_jpb: '08', nama_jpb: 'Bengkel/Gudang/Pertanian', urutan: 8 },
  { kode_jpb: '09', nama_jpb: 'Gedung Pemerintah', urutan: 9 },
  { kode_jpb: '10', nama_jpb: 'Lain-lain', urutan: 10 },
  { kode_jpb: '11', nama_jpb: 'Bangunan Tidak Kena Pajak', urutan: 11 },
  { kode_jpb: '12', nama_jpb: 'Bangunan Parkir', urutan: 12 },
  { kode_jpb: '13', nama_jpb: 'Apartemen', urutan: 13 },
  { kode_jpb: '14', nama_jpb: 'Pompa Bensin', urutan: 14 },
  { kode_jpb: '15', nama_jpb: 'Tangki Minyak', urutan: 15 },
  { kode_jpb: '16', nama_jpb: 'Gedung Sekolah', urutan: 16 },
];

async function main() {
  console.log('🌱 Seeding referensi_jenis_penggunaan_bangunan...');

  let inserted = 0;
  let skipped = 0;

  for (const item of DATA_JPB) {
    const existing = await prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: item.kode_jpb },
    });

    if (existing) {
      console.log(`  ⏭️  Kode ${item.kode_jpb} (${item.nama_jpb}) sudah ada, dilewati`);
      skipped++;
      continue;
    }

    await prisma.referensiJenisPenggunaanBangunan.create({ data: item });
    console.log(`  ✅ Kode ${item.kode_jpb} — ${item.nama_jpb}`);
    inserted++;
  }

  console.log(`\n✨ Selesai: ${inserted} data ditambahkan, ${skipped} dilewati.`);
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
