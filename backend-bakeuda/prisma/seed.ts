import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Cek apakah admin BAKEUDA sudah ada (Idempotent check)
  const adminExists = await prisma.user.findFirst({
    where: { role: Role.BAKEUDA },
  });

  if (adminExists) {
    console.log('✅ Seeder dilewati: Admin BAKEUDA sudah ada di database.');
    return;
  }

  // 2. Gunakan password dari ENV, atau generate password random sementara
  const rawPassword = process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-8) + 'A1@';
  const hashedPassword = await bcrypt.hash(rawPassword, 12);

  // 3. Buat Admin BAKEUDA default
  const adminBakeuda = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama_lengkap: 'Super Admin BAKEUDA',
      username: 'admin',
      password_hash: hashedPassword,
      role: Role.BAKEUDA,
    },
  });

  console.log('✅ Seeder berhasil dijalankan!');
  console.log('---');
  console.log(`👤 Username : ${adminBakeuda.username}`);
  console.log(`🔑 Password : ${rawPassword}`);
  console.log('---');
  console.log('⚠️  HARAP SIMPAN PASSWORD INI. Anda akan dipaksa untuk mengubahnya pada saat login pertama.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
