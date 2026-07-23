import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS sync_log CASCADE;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE objek_bangunan DROP COLUMN IF EXISTS oracle_synced_at;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE objek_bumi DROP COLUMN IF EXISTS oracle_synced_at;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE objek_pajak DROP COLUMN IF EXISTS oracle_source, DROP COLUMN IF EXISTS oracle_synced_at;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE subjek_pajak DROP COLUMN IF EXISTS oracle_source, DROP COLUMN IF EXISTS oracle_synced_at;`);
  console.log('Drift columns dropped!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
