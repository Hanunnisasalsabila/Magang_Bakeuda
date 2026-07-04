import { Module } from '@nestjs/common';
import { SubjekPajakController } from './subjek-pajak.controller.js';
import { SubjekPajakService } from './subjek-pajak.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SubjekPajakController],
  providers: [SubjekPajakService],
})
export class SubjekPajakModule {}
