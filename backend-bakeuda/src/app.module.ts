import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { OracleModule } from './oracle/oracle.module.js';
import { WilayahModule } from './wilayah/wilayah.module.js';
import { SubjekPajakModule } from './subjek-pajak/subjek-pajak.module.js';
import { ObjekPajakModule } from './objek-pajak/objek-pajak.module.js';
import { SpptModule } from './sppt/sppt.module.js';
import { ReferensiJpbModule } from './referensi-jpb/referensi-jpb.module.js';
import { TransaksiSpopModule } from './transaksi-spop/transaksi-spop.module.js';
import { PejabatDesaModule } from './pejabat-desa/pejabat-desa.module.js';
import { ReferensiDbkbModule } from './referensi-dbkb/referensi-dbkb.module.js';
import { ReferensiNilaiFasilitasModule } from './referensi-nilai-fasilitas/referensi-nilai-fasilitas.module.js';
import { ActivitiesModule } from './activities/activities.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OracleModule,
    WilayahModule,
    SubjekPajakModule,
    ObjekPajakModule,
    SpptModule,
    ReferensiJpbModule,
    TransaksiSpopModule,
    PejabatDesaModule,
    ReferensiDbkbModule,
    ReferensiNilaiFasilitasModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
