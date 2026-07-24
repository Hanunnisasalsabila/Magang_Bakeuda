import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  try {
    await prisma.transaksiSpop.create({
      data: {
        id_transaksi: 'TEST-123',
        lampiran: {
          create: { uploaded_by: 'test' }
        }
      }
    });
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
