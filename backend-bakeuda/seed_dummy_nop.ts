import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dummyNops = [
    { nop: '330301000101500420', nama: 'H. Ahmad Dahlan', alamat: 'Jl. Jend. Sudirman No. 45, Purbalingga Kidul' },
    { nop: '330301000101500431', nama: 'Siti Aminah', alamat: 'Perum Griya Abdi Karya Blok C-12, Purbalingga' },
    { nop: '330302000500100890', nama: 'PT. Makmur Sentosa', alamat: 'Kawasan Industri Kalimanah No. 8' }
  ];

  // Pastikan admin user exists to link created_by
  let admin = await prisma.user.findFirst();
  if (!admin) {
    console.error('Tidak ada user admin di database, jalankan npm run seed dulu!');
    return;
  }

  for (const item of dummyNops) {
    // Upsert Subjek Pajak (Dummy Owner)
    const subjek = await prisma.subjekPajak.upsert({
      where: { nik: '3303011234567890'.slice(0, 12) + item.nop.slice(-4) }, // Generate 16 digit NIK
      update: {},
      create: {
        nik: '3303011234567890'.slice(0, 12) + item.nop.slice(-4),
        nama_subjek: item.nama,
        status_wp: 'PEMILIK',
        pekerjaan: 'LAINNYA',
        alamat_jalan: item.alamat,
        kelurahan: 'Purbalingga Kidul',
        kabupaten: 'Purbalingga',
        created_by: admin.id_user,
      }
    });

    // Upsert Objek Pajak
    await prisma.objekPajak.upsert({
      where: { nop: item.nop },
      update: {},
      create: {
        nop: item.nop,
        kode_propinsi: item.nop.substring(0, 2),
        kode_dati2: item.nop.substring(2, 4),
        kode_kecamatan: item.nop.substring(4, 7),
        kode_kelurahan: item.nop.substring(7, 10),
        kode_blok: item.nop.substring(10, 13),
        no_urut: item.nop.substring(13, 17),
        kode_jenis_op: item.nop.substring(17, 18),
        nik_subjek: subjek.nik,
        jalan_op: item.alamat,
        kelurahan_op: 'Purbalingga Kidul',
        kecamatan_op: 'Purbalingga',
        jenis_tanah: 'TANAH_BANGUNAN',
        luas_tanah: 100,
        luas_bangunan: 50,
      }
    });
  }

  console.log('✅ Dummy NOP berhasil ditambahkan ke database!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
