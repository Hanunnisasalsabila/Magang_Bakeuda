import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.updateMany({
    data: { password_hash: hashedPassword }
  });
  console.log('All passwords have been reset to: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
