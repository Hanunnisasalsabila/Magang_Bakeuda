import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import * as fs from 'fs';
import { BadRequestException, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    fs.appendFileSync('backend_errors.log', '\n[GLOBAL EXCEPTION] ' + new Date().toISOString() + '\n' + (exception instanceof Error ? exception.stack : String(exception)) + '\n' + (exception instanceof HttpException ? JSON.stringify(exception.getResponse()) : '') + '\n');
    super.catch(exception, host);
  }
}

// Trigger restart for Prisma schema sync
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: semua route dimulai dengan /api
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors();
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // ValidationPipe: validasi DTO otomatis
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        fs.appendFileSync('backend_errors.log', JSON.stringify(errors, null, 2) + '\n');
        return new BadRequestException(errors);
      },
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



