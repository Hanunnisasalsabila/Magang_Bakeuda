import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PejabatDesaService } from './pejabat-desa.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('pejabat-desa')
@UseGuards(JwtAuthGuard)
export class PejabatDesaController {
  constructor(private readonly pejabatDesaService: PejabatDesaService) {}

  @Get(':kode_wilayah')
  async getByKodeWilayah(@Param('kode_wilayah') kode_wilayah: string) {
    return this.pejabatDesaService.getByKodeWilayah(kode_wilayah);
  }
}
