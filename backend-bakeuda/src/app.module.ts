import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { WilayahModule } from './wilayah/wilayah.module.js';
import { SubjekPajakModule } from './subjek-pajak/subjek-pajak.module.js';
import { ObjekPajakModule } from './objek-pajak/objek-pajak.module.js';
import { SpptModule } from './sppt/sppt.module.js';
import { TransaksiSpopModule } from './transaksi-spop/transaksi-spop.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WilayahModule,
    SubjekPajakModule,
    ObjekPajakModule,
    SpptModule,
    TransaksiSpopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
