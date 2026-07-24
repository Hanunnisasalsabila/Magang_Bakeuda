import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe('DELETE FROM lampiran_dokumen');
  console.log('Cleared');
}
main().finally(() => prisma.$disconnect());
