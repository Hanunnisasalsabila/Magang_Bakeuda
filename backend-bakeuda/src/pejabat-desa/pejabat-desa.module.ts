import { Module } from '@nestjs/common';
import { PejabatDesaController } from './pejabat-desa.controller.js';
import { PejabatDesaService } from './pejabat-desa.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PejabatDesaController],
  providers: [PejabatDesaService]
})
export class PejabatDesaModule {}
