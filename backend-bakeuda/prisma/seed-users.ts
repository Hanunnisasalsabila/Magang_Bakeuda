import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function toTitleCase(str: string) {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function main() {
  const wilayahs = await prisma.wilayah.findMany();
  
  let count = 0;

  for (const w of wilayahs) {
    if (!w.nama_desa) continue;
    
    // "KARANG CEGAK" -> "Karangcegak"
    let baseUsername = w.nama_desa.replace(/\s+/g, '').toLowerCase();
    baseUsername = baseUsername.charAt(0).toUpperCase() + baseUsername.slice(1);
    
    let username = baseUsername;
    let counter = 1;
    
    // Check if username already exists
    while (true) {
      const existing = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!existing) {
        break; // username is available
      }
      
      // If the user already belongs to this wilayah, skip
      if (existing.kode_wilayah === w.kode_wilayah) {
        username = ''; // Signal to skip
        break;
      }

      // Generate new username for duplicate
      counter++;
      username = `${baseUsername}${counter}`;
    }

    if (!username) {
      // console.log(`User for wilayah ${w.kode_wilayah} already exists, skipping...`);
      continue;
    }
    
    const password = `${username}123`;
    const password_hash = await bcrypt.hash(password, 10);
    const nama_lengkap = `Admin Desa ${toTitleCase(w.nama_desa)}`;
    
    await prisma.user.create({
      data: {
        username,
        password_hash,
        nama_lengkap,
        role: 'DESA',
        kode_wilayah: w.kode_wilayah,
        nip: null
      }
    });
    
    console.log(`Created user: ${username} (Wilayah: ${w.kode_wilayah})`);
    count++;
  }
  
  console.log(`\nSeed completed! Successfully created ${count} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
