const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.riwayatPelacakan.deleteMany()
  .then(() => console.log('cleared'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
