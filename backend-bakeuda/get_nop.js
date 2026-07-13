import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const o = await prisma.objekPajak.findFirst();
  console.log('NOP_TERSEDIA: ', o ? o.nop : 'KOSONG');
  
  const objs = await prisma.objekPajak.findMany({ take: 3 });
  console.log('List NOP: ', objs.map(x => x.nop).join(', '));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
