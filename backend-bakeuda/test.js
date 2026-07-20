import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const user = await prisma.user.findFirst();
    const tx = await prisma.transaksiSpop.create({
      data: {
        id_user: user.id_user,
        tahun_pajak: 2026,
        jenis_transaksi: 'BARU',
        nama_pengaju: 'DRAFT',
        tanggal_pengajuan: new Date(),
        status_ajuan: 'DRAFT',
        menggunakan_kuasa: false,
      }
    });
    console.log('TX OK:', tx.id_transaksi);
    
    await prisma.detailTransaksiTujuan.create({
        data: {
          id_transaksi: tx.id_transaksi,
          calon_subjek_json: { alamat: '', rt: '', rw: '', kelurahan: '', kabupaten: 'Purbalingga' },
          luas_tanah_baru: 0,
          luas_bangunan_baru: 0,
          jumlah_bangunan_baru: 0,
          jenis_tanah_baru: 'TANAH_KOSONG',
          jalan_op_baru: '',
          kelurahan_op_baru: '',
          kecamatan_op_baru: ''
        }
    });
    console.log('DETAIL OK');
    
    await prisma.transaksiSpop.delete({where: {id_transaksi: tx.id_transaksi}});
  } catch(e) {
    console.error('ERROR:', e);
  }
}
main().finally(() => prisma.$disconnect());
