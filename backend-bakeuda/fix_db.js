const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$executeRawUnsafe('UPDATE wilayah SET kode_kec = SUBSTRING(kode_wilayah FROM 5 FOR 3), kode_kel = SUBSTRING(kode_wilayah FROM 8 FOR 3)');
  console.log('Fixed DB successfully', result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
