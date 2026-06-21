import 'dotenv/config';
import { PrismaClient, Role } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@12345', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama_lengkap: 'Administrator',
      username: 'admin',
      password: hashedPassword,
      role: Role.admin,
      kode_wilayah: 'KW-001',
    },
  });

  console.log('✅ Seed berhasil:', admin.username, `(${admin.role})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
