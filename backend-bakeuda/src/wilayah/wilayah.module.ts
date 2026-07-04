import { Module } from '@nestjs/common';
import { WilayahController } from './wilayah.controller.js';
import { WilayahService } from './wilayah.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [WilayahController],
  providers: [WilayahService],
})
export class WilayahModule {}
