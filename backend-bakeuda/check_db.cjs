const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const objek = await prisma.objekPajak.findUnique({
    where: { nop: '330307001200700010' },
    include: { bumi: true }
  });
  console.log(JSON.stringify(objek, null, 2));
}
main().finally(() => prisma.$disconnect());
