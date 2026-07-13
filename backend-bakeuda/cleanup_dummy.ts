import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning up dummy regions...');
  
  // Clean up users associated with dummy regions
  await prisma.user.deleteMany({
    where: {
      kode_wilayah: { in: ['3303010001', '3303010002'] }
    }
  }).catch(() => console.log('User table might not exist or be empty'));
  console.log('Dummy users deleted.');

  // Clean up the dummy regions
  await prisma.wilayah.deleteMany({
    where: {
      kode_wilayah: { in: ['3303010001', '3303010002'] }
    }
  }).catch(e => console.log('Error deleting wilayah', e));
  console.log('Dummy regions deleted.');
  
  const count = await prisma.wilayah.count().catch(() => 0);
  console.log('Total Wilayah remaining:', count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
