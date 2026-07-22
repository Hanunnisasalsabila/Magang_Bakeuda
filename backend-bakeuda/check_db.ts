import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tx = await prisma.transaksiSpop.findFirst({
    where: { jenis_transaksi: 'PECAH' },
    orderBy: { tanggal_pengajuan: 'desc' },
    include: { pengaju: true }
  });
  console.log('Latest PECAH TX:', JSON.stringify(tx, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
