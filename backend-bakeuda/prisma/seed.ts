import 'dotenv/config';
import { PrismaClient, Role } from './generated/index.js';
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
      nama_lengkap: 'Administrator Bakeuda',
      username: 'admin',
      password_hash: hashedPassword,
      role: Role.BAKEUDA,
      kode_wilayah: 'KW-001',
    },
  });

  const desa = await prisma.user.upsert({
    where: { username: 'desa01' },
    update: {},
    create: {
      nama_lengkap: 'Perangkat Desa 01',
      username: 'desa01',
      password_hash: hashedPassword,
      role: Role.DESA,
      kode_wilayah: 'KW-001',
    },
  });

  console.log('✅ Seed berhasil:', admin.username, `(${admin.role})`);
  console.log('✅ Seed berhasil:', desa.username, `(${desa.role})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
