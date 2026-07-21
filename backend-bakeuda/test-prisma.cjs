const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const id = '8254bf5a-38fd-40d9-99df-f930003a7138';
    
    // Clean up relations first exactly like the service does
    await prisma.$transaction(async (tx) => {
      await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi: id } });
      await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi: id } });
      await tx.lampiranDokumen.deleteMany({ where: { id_transaksi: id } });

      await tx.transaksiSpop.update({
        where: { id_transaksi: id },
        data: {
          tahun_pajak: 2026,
          jenis_transaksi: 'BARU',
          menggunakan_kuasa: false,
          detail_tujuan: {
            create: [{
              nik_calon_subjek: '0000000000000000',
              luas_tanah_baru: 100,
              luas_bangunan_baru: 0,
              jenis_tanah_baru: 'TANAH_BANGUNAN',
              jalan_op_baru: 'Jalan',
              rt_op_baru: '01',
              rw_op_baru: '01',
              kelurahan_op_baru: 'Kel',
              koordinat_polygon: [],
              calon_subjek_json: { nik: '00' }
            }]
          }
        }
      });
    });
    console.log('Success!');
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
