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
      
      if (w.kode_kec !== correctKodeKec || w.kode_kel !== correctKodeKel) {
        await prisma.wilayah.update({
          where: { kode_wilayah: w.kode_wilayah },
          data: {
            kode_kec: correctKodeKec,
            kode_kel: correctKodeKel
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
