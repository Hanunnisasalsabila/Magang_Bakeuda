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
  const passwordHash = await bcrypt.hash('desa123', 10);
  await prisma.user.upsert({
    where: { username: 'desa' },
    update: { password_hash: passwordHash },
    create: {
      id_user: 'desa-12345',
      nama_lengkap: 'Perangkat Desa',
      username: 'desa',
      password_hash: passwordHash,
      role: 'DESA',
    },
  });
  console.log("Desa user created!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
