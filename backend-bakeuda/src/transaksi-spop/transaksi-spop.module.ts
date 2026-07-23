import { Module } from '@nestjs/common';
import { TransaksiSpopController } from './transaksi-spop.controller.js';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OracleModule } from '../oracle/oracle.module.js';
import { NopGeneratorService } from '../lib/nop-generator.js';

@Module({
  imports: [PrismaModule, OracleModule],
  controllers: [TransaksiSpopController],
  providers: [TransaksiSpopService, NopGeneratorService]
})
export class TransaksiSpopModule {}
