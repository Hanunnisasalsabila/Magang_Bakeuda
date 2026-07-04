import { Module } from '@nestjs/common';
import { SpptController } from './sppt.controller.js';
import { SpptService } from './sppt.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SpptController],
  providers: [SpptService],
})
export class SpptModule {}
