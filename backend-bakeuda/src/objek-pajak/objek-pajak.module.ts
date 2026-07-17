import { Module } from '@nestjs/common';
import { ObjekPajakController } from './objek-pajak.controller.js';
import { ObjekPajakService } from './objek-pajak.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
import { PbbCalculatorService } from '../lib/pbb-calculator.js';

@Module({
  imports: [PrismaModule],
  controllers: [ObjekPajakController],
  providers: [ObjekPajakService, NopGeneratorService, PbbCalculatorService],
})
export class ObjekPajakModule {}
