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
  // 0. Buat Data Wilayah dari wilayahData.json
  const wilayahDataPath = path.join(process.cwd(), '..', 'frontend-bakeuda', 'src', 'utils', 'wilayahData.json');
  const wilayahDataRaw = fs.readFileSync(wilayahDataPath, 'utf8');
  const wilayahData = JSON.parse(wilayahDataRaw);

  console.log(`Menyimpan ${wilayahData.length} data wilayah...`);
  
  // Menggunakan createMany untuk mempercepat jika belum ada, atau upsert jika perlu
  for (const w of wilayahData) {
    await prisma.wilayah.upsert({
      where: { kode_wilayah: w.kode_wilayah },
      update: {},
      create: {
        kode_wilayah: w.kode_wilayah,
        nama_desa: w.nama_desa,
        kode_kel: w.kode_kel,
        kecamatan: w.kecamatan,
        kode_kec: w.kode_kec,
        kabupaten: w.kabupaten,
        kode_kab: w.kode_kab,
      },
    });
  }
  console.log('✅ Berhasil insert wilayah.');

  // 1. Buat Data Pejabat Desa Dummy
  await prisma.pejabatDesa.upsert({
    where: { nip: '198001012010011001' },
    update: {},
    create: {
      nip: '198001012010011001',
      nama_pejabat: 'Budi Santoso',
      jabatan: 'Kepala Desa',
      kode_wilayah: '3303012001',
    },
  });

  await prisma.pejabatDesa.upsert({
    where: { nip: '198502022015022002' },
    update: {},
    create: {
      nip: '198502022015022002',
      nama_pejabat: 'Siti Aminah',
      jabatan: 'Sekretaris Desa',
      kode_wilayah: '3303012001',
    },
  });

  // 2. Cek apakah admin BAKEUDA sudah ada (Idempotent check)
  const adminExists = await prisma.user.findFirst({
    where: { role: Role.BAKEUDA },
  });

  if (adminExists) {
    console.log('✅ Seeder dilewati: Admin BAKEUDA sudah ada di database.');
    return;
  }

  // 2. Gunakan password dari ENV, atau generate password random sementara
  const rawPassword = 'Bakeuda2026!';
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
      kode_wilayah: '3303012001',
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
