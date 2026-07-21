import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      id_user: 'admin',
      username: 'admin',
      password_hash: '123',
      role: 'BAKEUDA',
      nama_lengkap: 'Admin'
    }
  });
  console.log('admin user created');
}
main().catch(console.error).finally(() => prisma.$disconnect());
