import { Module } from '@nestjs/common';
import { ReferensiNilaiFasilitasController } from './referensi-nilai-fasilitas.controller.js';
import { ReferensiNilaiFasilitasService } from './referensi-nilai-fasilitas.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReferensiNilaiFasilitasController],
  providers: [ReferensiNilaiFasilitasService],
  exports: [ReferensiNilaiFasilitasService],
})
export class ReferensiNilaiFasilitasModule {}
