import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { CreateSpopDto } from './dto/create-spop.dto.js';
import { VerifikasiDesaDto } from './dto/verifikasi-desa.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('transaksi-spop')
@UseGuards(JwtAuthGuard)
export class TransaksiSpopController {
  constructor(private readonly transaksiSpopService: TransaksiSpopService) {}

  @Get()
  async getAll(
    @Query('status_ajuan') status_ajuan?: string,
    @Request() req?: any
  ) {
    const kode_wilayah = req.user.kode_wilayah;
    return this.transaksiSpopService.getAllTransaksi(status_ajuan, kode_wilayah);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    const kode_wilayah = req.user.kode_wilayah;
    return this.transaksiSpopService.getStats(kode_wilayah);
  }

  @Get(':id')
  async getDetail(
    @Param('id') id_transaksi: string,
    @Request() req: any
  ) {
    const kodeWilayahUser = req.user.kode_wilayah;
    return this.transaksiSpopService.getDetailTransaksi(id_transaksi, kodeWilayahUser);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDraft(@Body() dto: CreateSpopDto, @Request() req: any) {
    return this.transaksiSpopService.createDraft(dto, req.user.id_user);
  }

  @Patch(':id/ajukan-internal')
  async ajukanInternal(
    @Param('id') id_transaksi: string,
    @Request() req: any
  ) {
    const userWilayah = req.user.kode_wilayah; 
    return this.transaksiSpopService.ajukanKeLurah(id_transaksi, userWilayah);
  }

  @Patch(':id/verifikasi-desa')
  async verifikasiDesa(
    @Param('id') id_transaksi: string,
    @Body() dto: VerifikasiDesaDto,
    @Request() req: any
  ) {
    const kodeWilayahUser = req.user.kode_wilayah; 
    return this.transaksiSpopService.verifikasiOlehDesa(id_transaksi, dto, kodeWilayahUser);
  }
}
