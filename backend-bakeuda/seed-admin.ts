import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // Admin A
  const adminA = await prisma.user.upsert({
    where: { username: 'admin.a' },
    update: {},
    create: {
      username: 'admin.a',
      password_hash: passwordHash,
      nama_lengkap: 'Admin A (Bakeuda)',
      role: 'BAKEUDA',
      is_active: true,
    },
  });

  // Admin B
  const adminB = await prisma.user.upsert({
    where: { username: 'admin.b' },
    update: {},
    create: {
      username: 'admin.b',
      password_hash: passwordHash,
      nama_lengkap: 'Admin B (Bakeuda)',
      role: 'BAKEUDA',
      is_active: true,
    },
  });

  console.log('✅ Berhasil membuat 2 admin penguji:');
  console.log('1. Username: admin.a | Password: 123456');
  console.log('2. Username: admin.b | Password: 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
