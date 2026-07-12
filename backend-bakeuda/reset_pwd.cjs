const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function run() {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('admin123', 12);
  await prisma.user.updateMany({
    data: { password_hash: hash }
  });
  console.log('Passwords reset to admin123');
  await prisma.$disconnect();
}

run();
