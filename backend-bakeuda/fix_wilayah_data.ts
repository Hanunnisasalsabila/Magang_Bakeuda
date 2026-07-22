import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allWilayah = await prisma.wilayah.findMany();
  
  let count = 0;
  for (const w of allWilayah) {
    if (w.kode_wilayah.length === 10) {
      const correctKodeKec = w.kode_wilayah.substring(4, 7);
      const correctKodeKel = w.kode_wilayah.substring(7, 10);
      
      if (w.kode_kecamatan !== correctKodeKec || w.kode_kelurahan !== correctKodeKel) {
        await prisma.wilayah.update({
          where: { kode_wilayah: w.kode_wilayah },
          data: {
            kode_kecamatan: correctKodeKec,
            kode_kelurahan: correctKodeKel
          }
        });
        count++;
      }
    }
  }
  
  console.log('Fixed', count, 'wilayah records.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
