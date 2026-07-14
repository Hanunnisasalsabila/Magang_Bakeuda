import { Module } from '@nestjs/common';
import { ReferensiJpbController } from './referensi-jpb.controller.js';
import { ReferensiJpbService } from './referensi-jpb.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReferensiJpbController],
  providers: [ReferensiJpbService],
})
export class ReferensiJpbModule {}
