import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.wilayah.deleteMany({});
  console.log('All Wilayah deleted.');
}

main().finally(() => prisma.$disconnect());
