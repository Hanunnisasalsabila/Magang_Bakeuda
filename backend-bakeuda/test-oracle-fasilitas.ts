import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module.js';
import { OracleService } from './src/oracle/oracle.service.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const oracle = app.get(OracleService);
  const result = await oracle.query('SELECT * FROM DAT_FASILITAS_BANGUNAN WHERE ROWNUM = 1');
  console.log('DAT_FASILITAS_BANGUNAN COLUMNS:', Object.keys(result[0]));
  console.log('DATA:', result[0]);
  await app.close();
}
bootstrap();
