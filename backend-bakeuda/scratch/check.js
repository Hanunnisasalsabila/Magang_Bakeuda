const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  console.log('Users:', await prisma.user.findMany({ select: { username: true, role: true, kode_wilayah: true }})); 
  console.log('Subjek Pajak:', await prisma.subjekPajak.count());
  console.log('Objek Pajak:', await prisma.objekPajak.count());
} 

main().finally(() => prisma.$disconnect());
