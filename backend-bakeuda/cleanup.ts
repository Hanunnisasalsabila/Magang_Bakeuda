
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const wilayahDataPath = path.join(process.cwd(), '..', 'frontend-bakeuda', 'src', 'utils', 'wilayahData.json');
  const wilayahDataRaw = fs.readFileSync(wilayahDataPath, 'utf8');
  const wilayahData = JSON.parse(wilayahDataRaw);

  const validKodes = wilayahData.map((w: any) => w.kode_wilayah);
  
  const allWilayah = await prisma.wilayah.findMany();
  
  let deleted = 0;
  for (const w of allWilayah) {
    if (!validKodes.includes(w.kode_wilayah)) {
      console.log('Deleting invalid wilayah:', w.nama_desa, w.kode_wilayah);
      try {
        await prisma.wilayah.delete({ where: { kode_wilayah: w.kode_wilayah } });
        deleted++;
      } catch (e: any) {
        console.log('Failed to delete', w.nama_desa, e.message);
      }
    }
  }
  console.log('Deleted', deleted, 'invalid items.');
}
main();

