
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const acts = await prisma.userActivity.findMany({
    orderBy: { created_at: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(acts, null, 2));
}
main();

