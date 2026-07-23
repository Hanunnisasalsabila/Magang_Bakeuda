import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:905.Nasywa@localhost:5432/pbb_db' });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  try {
    const result = await prisma.transaksiSpop.findMany({
      include: {
        pengaju: { select: { nama_lengkap: true, kode_wilayah: true } },
      }
    });
    console.log("RECORDS IN DB:", result.length);
    result.forEach(r => console.log(`Transaksi ${r.id_transaksi} -> Pengaju Wilayah: ${r.pengaju?.kode_wilayah}`));
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
