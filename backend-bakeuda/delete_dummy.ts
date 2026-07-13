import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Update pejabat_desa & user...');
  await prisma.pejabatDesa.updateMany({ where: { kode_wilayah: { in: ['3303010001', '3303010002'] } }, data: { kode_wilayah: '3303012001' } });
  await prisma.user.updateMany({ where: { kode_wilayah: { in: ['3303010001', '3303010002'] } }, data: { kode_wilayah: '3303012001' } });
  console.log('Menghapus data wilayah dummy...');
  await prisma.wilayah.deleteMany({ where: { kode_wilayah: { in: ['3303010001', '3303010002'] } } }).catch(e => console.error(e));
  console.log('Selesai!');
}

main().finally(() => prisma.$disconnect());
