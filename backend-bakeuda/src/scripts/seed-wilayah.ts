import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const desaList = [
    {
      kode_propinsi: '33',
      kode_dati2: '03',
      kode_kecamatan: '010',
      kecamatan: 'Kemangkon',
      kode_kelurahan: '001',
      nama_desa: 'Majatengah',
    },
    {
      kode_propinsi: '33',
      kode_dati2: '03',
      kode_kecamatan: '010',
      kecamatan: 'Kemangkon',
      kode_kelurahan: '002',
      nama_desa: 'Muntang',
    },
  ];

  console.log(`Menjalankan seeder wilayah...`);

  for (const desa of desaList) {
    const kodeWilayah =
      desa.kode_propinsi.padStart(2, '0') +
      desa.kode_dati2.padStart(2, '0') +
      desa.kode_kecamatan.padStart(3, '0') +
      desa.kode_kelurahan.padStart(3, '0');

    await prisma.wilayah.upsert({
      where: { kode_wilayah: kodeWilayah },
      create: {
        kode_wilayah: kodeWilayah,
        kode_propinsi: desa.kode_propinsi,
        kode_dati2: desa.kode_dati2,
        kode_kecamatan: desa.kode_kecamatan,
        kecamatan: desa.kecamatan,
        kode_kelurahan: desa.kode_kelurahan,
        nama_desa: desa.nama_desa,
      },
      update: {},
    });

    console.log(`Seeded wilayah: ${desa.nama_desa} (${kodeWilayah})`);
  }

  console.log(`Seeding wilayah selesai.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
