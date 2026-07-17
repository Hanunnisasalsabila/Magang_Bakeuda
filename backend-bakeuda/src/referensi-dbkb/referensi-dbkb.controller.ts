import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReferensiDbkbService } from './referensi-dbkb.service.js';
import { UpdateReferensiDbkbDto } from './dto/update-referensi-dbkb.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('referensi-dbkb')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferensiDbkbController {
  constructor(private readonly service: ReferensiDbkbService) {}

  @Get()
  async findAll(@Query('kategori') kategori?: string) {
    if (kategori) return this.service.findByKategori(kategori);
    return this.service.findAll();
  }

  @Put(':id')
  @Roles('BAKEUDA')
  async update(@Param('id') id: string, @Body() dto: UpdateReferensiDbkbDto) {
    return this.service.update(id, dto);
  }
}
