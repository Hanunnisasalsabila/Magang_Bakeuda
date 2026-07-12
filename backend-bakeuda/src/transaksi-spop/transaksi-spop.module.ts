import { Module } from '@nestjs/common';
import { TransaksiSpopController } from './transaksi-spop.controller.js';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TransaksiSpopController],
  providers: [TransaksiSpopService]
})
export class TransaksiSpopModule {}
