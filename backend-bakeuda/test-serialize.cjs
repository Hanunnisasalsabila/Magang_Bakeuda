const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const objek = await prisma.objekPajak.findUnique({
    where: { nop: '330307001220000010' },
    include: { subjek_pajak: true, bumi: true, bangunan: true }
  });
  console.log(JSON.stringify(objek, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
