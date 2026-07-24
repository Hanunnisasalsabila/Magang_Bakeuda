import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const op = await prisma.objekPajak.findUnique({
    where: { nop: '330307001220000010' }
  })
  console.log(op)
}
main().finally(() => prisma.$disconnect())
