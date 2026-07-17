
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const wilayahData = require('../frontend-bakeuda/src/utils/wilayahData.json');

async function main() {
  const validKodes = wilayahData.map(w => w.kode_wilayah);
  const allWilayah = await prisma.wilayah.findMany();
  
  let deleted = 0;
  for (const w of allWilayah) {
    if (!validKodes.includes(w.kode_wilayah)) {
      console.log('Deleting invalid wilayah:', w.nama_desa);
      try {
        await prisma.wilayah.delete({ where: { kode_wilayah: w.kode_wilayah } });
        deleted++;
      } catch(e) {
        console.log('Failed to delete', w.nama_desa, e.message);
      }
    }
  }
  console.log('Deleted', deleted, 'invalid items.');
}
main();

