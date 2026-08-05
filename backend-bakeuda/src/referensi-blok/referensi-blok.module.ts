import { Module } from '@nestjs/common';
import { ReferensiBlokController } from './referensi-blok.controller.js';
import { ReferensiBlokService } from './referensi-blok.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReferensiBlokController],
  providers: [ReferensiBlokService],
  exports: [ReferensiBlokService],
})
export class ReferensiBlokModule {}
