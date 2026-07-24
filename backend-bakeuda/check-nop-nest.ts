import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module.js';
import { ObjekPajakService } from './src/objek-pajak/objek-pajak.service.js';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(ObjekPajakService);
  const user = { username: 'admin', role: 'BAKEUDA' } as any;
  const res = await service.getByNop('330307001200300040', user);
  console.log('--- NOP DATA ---');
  console.log('RT:', res.data.rt_op);
  console.log('RW:', res.data.rw_op);
  console.log('Alamat:', res.data.jalan_op);
  console.log('Bumi:', res.data.bumi);
  await app.close();
}
main().catch(console.error);
