import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ReferensiNilaiFasilitasService } from './referensi-nilai-fasilitas.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('referensi-nilai-fasilitas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferensiNilaiFasilitasController {
  constructor(private readonly service: ReferensiNilaiFasilitasService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Put(':id')
  @Roles('BAKEUDA')
  async update(@Param('id') id: string, @Body() dto: { nilai_tambah: number }) {
    return this.service.update(id, dto);
  }
}
