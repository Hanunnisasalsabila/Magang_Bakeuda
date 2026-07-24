import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const nop = '330307001200300040';
  const obj = await prisma.objekPajak.findUnique({ where: { nop } });
  console.log('rt_op:', obj?.rt_op);
  console.log('rw_op:', obj?.rw_op);
  console.log('alamat:', obj?.jalan_op);
}
main().catch(console.error).finally(() => prisma.$disconnect());
