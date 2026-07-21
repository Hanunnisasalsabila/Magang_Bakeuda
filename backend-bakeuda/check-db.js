import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.transaksiSpop.findUnique({where: {id_transaksi: '8254bf5a-38fd-40d9-99df-f930003a7138'}}).then(console.log).finally(()=>prisma.$disconnect());
