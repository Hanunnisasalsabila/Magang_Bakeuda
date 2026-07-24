import { Module } from '@nestjs/common';
import { TransaksiSpopController } from './transaksi-spop.controller.js';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OracleModule } from '../oracle/oracle.module.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
import { NotifikasiModule } from '../notifikasi/notifikasi.module.js';

@Module({
  imports: [PrismaModule, OracleModule, NotifikasiModule],
  controllers: [TransaksiSpopController],
  providers: [TransaksiSpopService, NopGeneratorService]
})
export class TransaksiSpopModule {}
