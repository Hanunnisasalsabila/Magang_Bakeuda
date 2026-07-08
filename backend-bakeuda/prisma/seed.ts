import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 0. Buat Data Wilayah Dummy (Standar SISMIOP: Kec 3 digit, Desa 3 digit, total 10 digit tanpa titik)
  const wilayah1 = await prisma.wilayah.upsert({
    where: { kode_wilayah: '3303010001' },
    update: {},
    create: {
      kode_wilayah: '3303010001',
      nama_desa: 'KEDUNGBENDA',
      kode_kel: '001',
      kecamatan: 'KEMANGKON',
      kode_kec: '010',
      kabupaten: 'KAB. PURBALINGGA',
      kode_kab: '03',
    },
  });

  const wilayah2 = await prisma.wilayah.upsert({
    where: { kode_wilayah: '3303010002' },
    update: {},
    create: {
      kode_wilayah: '3303010002',
      nama_desa: 'BOKOL',
      kode_kel: '002',
      kecamatan: 'KEMANGKON',
      kode_kec: '010',
      kabupaten: 'KAB. PURBALINGGA',
      kode_kab: '03',
    },
  });

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
      force_change_password: true,
    },
  });

  // 4. Buat akun DESA untuk testing
  const desa = await prisma.user.upsert({
    where: { username: 'desa01' },
    update: {},
    create: {
      nama_lengkap: 'Perangkat Desa 01',
      username: 'desa01',
      password_hash: hashedPassword,
      role: Role.DESA,
      kode_wilayah: wilayah1.kode_wilayah,
      force_change_password: true,
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
