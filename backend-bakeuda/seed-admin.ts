import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password_hash: adminPassword },
    create: {
      id_user: 'admin-12345',
      nama_lengkap: 'Super Admin Bakeuda',
      username: 'admin',
      password_hash: adminPassword,
      role: 'BAKEUDA',
    },
  });
  console.log("Admin user created!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
