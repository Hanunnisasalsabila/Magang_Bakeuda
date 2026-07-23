import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { OracleService } from './src/oracle/oracle.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const oracle = app.get(OracleService);
  
  try {
    const res1 = await oracle.query('SELECT * FROM REF_JPB');
    console.log('REF_JPB', res1[0]);
  } catch (e) {
    console.log('Error REF_JPB', e.message);
  }

  try {
    const res2 = await oracle.query('SELECT * FROM REFF_JPB');
    console.log('REFF_JPB', res2[0]);
  } catch (e) {
    console.log('Error REFF_JPB', e.message);
  }

  await app.close();
}
bootstrap();
