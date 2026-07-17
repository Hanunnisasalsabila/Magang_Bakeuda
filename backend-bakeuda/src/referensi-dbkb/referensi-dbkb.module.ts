import { Module } from '@nestjs/common';
import { ReferensiDbkbController } from './referensi-dbkb.controller.js';
import { ReferensiDbkbService } from './referensi-dbkb.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReferensiDbkbController],
  providers: [ReferensiDbkbService],
  exports: [ReferensiDbkbService],
})
export class ReferensiDbkbModule {}
