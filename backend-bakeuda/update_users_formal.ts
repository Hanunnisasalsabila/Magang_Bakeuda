import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function run() {
  const users = await prisma.user.findMany({ 
    where: { role: 'DESA' },
    orderBy: { created_at: 'asc' }
  });
  
  let updated = 0;
  // Group users by kode_wilayah to maintain a counter
  const counters: Record<string, number> = {};

  for (let u of users) {
    if (u.kode_wilayah) {
      const w = await prisma.wilayah.findUnique({ where: { kode_wilayah: u.kode_wilayah } });
      if (w) {
        if (!counters[u.kode_wilayah]) counters[u.kode_wilayah] = 1;
        
        const countStr = counters[u.kode_wilayah].toString().padStart(2, '0');
        const newUsername = `desa_${w.nama_desa.toLowerCase().replace(/[^a-z0-9]/g, '')}_${countStr}`;
        
        await prisma.user.update({
          where: { id_user: u.id_user },
          data: { 
            username: newUsername
          }
        });
        
        counters[u.kode_wilayah]++;
        updated++;
      }
    }
  }
  console.log(`Berhasil mengupdate ${updated} akun desa menjadi format formal.`);
}

run().catch(console.error).finally(() => process.exit(0));
