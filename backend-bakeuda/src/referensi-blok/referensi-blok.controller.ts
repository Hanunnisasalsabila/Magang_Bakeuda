import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ReferensiBlokService } from './referensi-blok.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('referensi-blok')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferensiBlokController {
  constructor(private readonly service: ReferensiBlokService) {}

  @Get()
  async findByWilayah(@Query('kode_wilayah') kodeWilayah: string) {
    return this.service.findByWilayah(kodeWilayah);
  }

  @Post()
  @Roles('BAKEUDA')
  async create(@Body() body: { kode_wilayah: string; kode_blok: string; keterangan?: string }) {
    return this.service.create(body.kode_wilayah, body.kode_blok, body.keterangan);
  }
}
