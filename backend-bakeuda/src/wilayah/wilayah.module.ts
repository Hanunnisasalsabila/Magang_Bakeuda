import { Module } from '@nestjs/common';
import { WilayahController } from './wilayah.controller.js';
import { WilayahService } from './wilayah.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ActivitiesModule } from '../activities/activities.module.js';

@Module({
  imports: [PrismaModule, ActivitiesModule],
  controllers: [WilayahController],
  providers: [WilayahService],
  exports: [WilayahService],
})
export class WilayahModule {}
