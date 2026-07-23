import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.delete({
    where: { username: 'admin' },
  }).catch(e => console.log('Admin already deleted or not found'));
  console.log('Done!');
}
main();
