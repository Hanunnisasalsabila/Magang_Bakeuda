import { Module } from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service.js';
import { NotifikasiController } from './notifikasi.controller.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [NotifikasiService],
  controllers: [NotifikasiController],
  exports: [NotifikasiService]
})
export class NotifikasiModule {}
