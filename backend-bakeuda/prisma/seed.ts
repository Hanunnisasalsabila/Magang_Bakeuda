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

  // 1. Buat Data Wilayah dari wilayahData.json
  const wilayahDataPath = path.join(process.cwd(), '..', 'frontend-bakeuda', 'src', 'utils', 'wilayahData.json');
  const wilayahDataRaw = fs.readFileSync(wilayahDataPath, 'utf8');
  const wilayahData = JSON.parse(wilayahDataRaw);

  console.log(`🗺️ Menyimpan ${wilayahData.length} data wilayah...`);
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
  console.log('✅ Berhasil insert data wilayah.');

  // ==========================================
  // LOGIKA 1: SUPER ADMIN (BAKEUDA)
  // Super Admin jumlahnya terbatas (biasanya hanya 1 atau beberapa orang di dinas pusat).
  // Mereka tidak terikat wilayah tertentu (kode_wilayah = null).
  // Oleh karena itu, akun mereka biasanya di-hardcode (dibuat manual) saat awal aplikasi berdiri.
  // ==========================================
  const adminPassword = await bcrypt.hash('AdminBakeuda2026!', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password_hash: adminPassword }, // Pastikan update passwordnya sesuai WA teman
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

  // ==========================================
  // LOGIKA 2: PERANGKAT DESA
  // Akun desa jumlahnya sangat banyak (sebanyak jumlah desa x jumlah perangkat).
  // Mereka terikat kuat pada SATU desa (punya kode_wilayah).
  // Kita buatkan sistem otomatis (generator) berdasarkan daftar wilayah.
  // ==========================================
  // Hapus semua akun DESA lama agar tidak terjadi duplikasi saat re-seed
  await prisma.user.deleteMany({ where: { role: Role.DESA } });
  await prisma.pejabatDesa.deleteMany();

  console.log('👥 Sedang men-generate akun perangkat desa (1 akun per desa = 239 Akun)...');
  const desaPassword = await bcrypt.hash('BakeudaDesa2026!', 12);

  for (const w of wilayahData) {
    if (!w.nama_desa) continue;

    const cleanNamaDesa = w.nama_desa.toLowerCase().replace(/[^a-z0-9]/g, ''); 
    const cleanKecamatan = w.kecamatan.toLowerCase().replace(/[^a-z0-9]/g, ''); 
    const usernameDesa = `desa_${cleanNamaDesa}_${cleanKecamatan}`;

    await prisma.user.upsert({
      where: { username: usernameDesa },
      update: {},
      create: {
        nama_lengkap: `Perangkat Desa ${w.nama_desa} (Kec. ${w.kecamatan})`,
        username: usernameDesa,
        password_hash: desaPassword,
        role: Role.DESA,
        kode_wilayah: w.kode_wilayah, 
        is_active: true,
        force_change_password: false,
      },
    });

    const nipDummy = `${w.kode_wilayah}001`; 
    await prisma.pejabatDesa.upsert({
      where: { nip: nipDummy },
      update: {},
      create: {
        nip: nipDummy,
        nama_pejabat: `Kepala Desa ${w.nama_desa}`,
        jabatan: 'Kepala Desa',
        kode_wilayah: w.kode_wilayah,
      },
    });
  }

  console.log('✅ Berhasil men-generate ribuan akun Perangkat Desa.');
  console.log('--- SEEDING SELESAI ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
