import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  console.log(`🗺️ Menghapus data akun admin lama...`);
  await prisma.user.deleteMany({
    where: { role: Role.BAKEUDA }
  });

  // ==========================================
  // LOGIKA 1: SUPER ADMIN (BAKEUDA)
  // Super Admin jumlahnya terbatas (biasanya hanya 1 atau beberapa orang di dinas pusat).
  // Mereka tidak terikat wilayah tertentu (kode_wilayah = null).
  // ==========================================
  const adminPassword = await bcrypt.hash('AdminBakeuda2026!', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password_hash: adminPassword },
    create: {
      nama_lengkap: 'Super Admin Utama BAKEUDA',
      username: 'admin',
      password_hash: adminPassword,
      role: Role.BAKEUDA,
      is_active: true,
      force_change_password: true,
    },
  });

  console.log('✅ Berhasil membuat akun Super Admin Bakeuda.');
  console.log('--- SEEDING SELESAI ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
