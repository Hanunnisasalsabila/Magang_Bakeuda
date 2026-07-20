import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
// Trigger restart for Prisma schema sync
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: semua route dimulai dengan /api
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors();

  // ValidationPipe: validasi DTO otomatis
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Tambahkan CORS manual
  app.enableCors({
    origin: 'http://localhost:5173', // Vite development server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();



