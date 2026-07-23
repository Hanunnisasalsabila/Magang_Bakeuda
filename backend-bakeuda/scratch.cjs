const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const op = await prisma.objekPajak.findUnique({where: {nop: '330301000100100011'}}); 
  const trx = await prisma.transaksiSpop.findFirst({where: {detail_tujuan: {some: {nop_generated: '330301000100100011'}}}, include: {detail_tujuan: true}}); 
  console.log('ObjekPajak:', op); 
  console.log('Transaksi:', JSON.stringify(trx, null, 2)); 
} 
main().finally(() => prisma.$disconnect());
