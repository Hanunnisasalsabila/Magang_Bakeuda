const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { username: true, role: true }
  });
  console.log('--- USERS IN DB ---');
  users.forEach(u => console.log(u.username, u.role));
  console.log('-------------------');
}

main().catch(console.error).finally(() => prisma.$disconnect());
