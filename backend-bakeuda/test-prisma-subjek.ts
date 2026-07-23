import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module.js';
import { PrismaService } from './src/prisma/prisma.service.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const count = await prisma.subjekPajak.count();
  console.log('SubjekPajak count:', count);
  await app.close();
}
bootstrap();
