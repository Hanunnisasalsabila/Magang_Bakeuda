import { Module } from '@nestjs/common';
import { ObjekPajakController } from './objek-pajak.controller.js';
import { ObjekPajakService } from './objek-pajak.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NopGeneratorService } from '../lib/nop-generator.js';

@Module({
  imports: [PrismaModule],
  controllers: [ObjekPajakController],
  providers: [ObjekPajakService, NopGeneratorService],
})
export class ObjekPajakModule {}
