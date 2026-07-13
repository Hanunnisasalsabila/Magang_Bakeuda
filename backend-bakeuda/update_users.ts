import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function run() {
  const users = await prisma.user.findMany({ where: { role: 'DESA' } });
  let updated = 0;
  for (let u of users) {
    if (u.kode_wilayah) {
      const w = await prisma.wilayah.findUnique({ where: { kode_wilayah: u.kode_wilayah } });
      if (w) {
        // Capitalize words for nama_lengkap
        const capitalize = (s) => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        const namaDesaFormat = capitalize(w.nama_desa);
        
        const newName = 'Perangkat Desa ' + namaDesaFormat;
        const newUsername = 'desa_' + w.nama_desa.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        await prisma.user.update({
          where: { id_user: u.id_user },
          data: { 
            nama_lengkap: newName, 
            username: newUsername + '_' + Math.random().toString(36).substring(2,5) 
          }
        });
        updated++;
      }
    }
  }
  console.log(`Berhasil mengupdate ${updated} akun desa.`);
}

run().catch(console.error).finally(() => process.exit(0));
