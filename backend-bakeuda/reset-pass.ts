import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:905.Nasywa@localhost:5432/pbb_db";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const newPassword = 'Bakeuda123!';
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.updateMany({
    data: {
      password_hash: hashedPassword,
      force_change_password: false
    }
  });

  console.log(`Password untuk semua user telah direset menjadi: ${newPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
