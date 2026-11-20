import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function cleanDummyData() {
  console.log('🧹 Memulai proses pembersihan data dummy / uji coba...');

  try {
    // Urutan penghapusan disesuaikan dengan hierarki Foreign Key (FK) database
    console.log('1️⃣ Menghapus data SPPT...');
    const deletedSppt = await prisma.sppt.deleteMany();
    console.log(`   └─ Terhapus: ${deletedSppt.count} baris data SPPT`);

    console.log('2️⃣ Menghapus detail transaksi pengajuan (asal & tujuan)...');
    const deletedDetailAsal = await prisma.detailTransaksiAsal.deleteMany();
    const deletedDetailTujuan = await prisma.detailTransaksiTujuan.deleteMany();
    console.log(`   └─ Terhapus: ${deletedDetailAsal.count} detail asal, ${deletedDetailTujuan.count} detail tujuan`);

    console.log('3️⃣ Menghapus lampiran & riwayat pelacakan transaksi...');
    const deletedLampiran = await prisma.lampiranDokumen.deleteMany();
    const deletedRiwayat = await prisma.riwayatPelacakan.deleteMany();
    console.log(`   └─ Terhapus: ${deletedLampiran.count} lampiran dokumen, ${deletedRiwayat.count} riwayat pelacakan`);

    console.log('4️⃣ Menghapus data Pengajuan SPOP (transaksi_spop)...');
    const deletedTransaksi = await prisma.transaksiSpop.deleteMany();
    console.log(`   └─ Terhapus: ${deletedTransaksi.count} transaksi SPOP`);

    console.log('5️⃣ Menghapus detail fasilitas bangunan...');
    const deletedFasilitas = await prisma.objekBangunanFasilitas.deleteMany();
    console.log(`   └─ Terhapus: ${deletedFasilitas.count} data fasilitas bangunan`);

    console.log('6️⃣ Menghapus data bangunan (LSPOP)...');
    const deletedBangunan = await prisma.objekBangunan.deleteMany();
    console.log(`   └─ Terhapus: ${deletedBangunan.count} data bangunan`);

    console.log('7️⃣ Menghapus data tanah / objek bumi...');
    const deletedBumi = await prisma.objekBumi.deleteMany();
    console.log(`   └─ Terhapus: ${deletedBumi.count} data tanah/bumi`);

    console.log('8️⃣ Menghapus data Objek Pajak utama...');
    const deletedObjek = await prisma.objekPajak.deleteMany();
    console.log(`   └─ Terhapus: ${deletedObjek.count} objek pajak`);

    console.log('9️⃣ Menghapus data Subjek Pajak (Wajib Pajak)...');
    const deletedSubjek = await prisma.subjekPajak.deleteMany();
    console.log(`   └─ Terhapus: ${deletedSubjek.count} subjek pajak`);

    console.log('🔟 Menghapus notifikasi & log aktivitas...');
    const deletedNotifikasi = await prisma.notifikasi.deleteMany();
    const deletedActivities = await prisma.userActivity.deleteMany();
    console.log(`   └─ Terhapus: ${deletedNotifikasi.count} notifikasi, ${deletedActivities.count} aktivitas`);

    // Bersihkan file berkas/foto yang tersimpan di folder uploads
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      let removedFiles = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          try {
            fs.unlinkSync(path.join(uploadsDir, file));
            removedFiles++;
          } catch (e) {
            // Abaikan jika file sedang terkunci
          }
        }
      }
      if (removedFiles > 0) {
        console.log(`📁 Berhasil membersihkan ${removedFiles} file lampiran fisik di folder /uploads`);
      }
    }

    console.log('\n======================================================');
    console.log('✨ PEMBERSIHAN DATA COBA-COBA SELESAI DENGAN SUKSES! ✨');
    console.log('======================================================');
    console.log('🔒 Data Wilayah (Kecamatan/Desa) dan Akun User (Admin & Desa) TETAP AMAN.');
    console.log('🚀 Dashboard, Objek Pajak, dan Antrean Verifikasi siap untuk demo fresh!');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat membersihkan database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDummyData();
