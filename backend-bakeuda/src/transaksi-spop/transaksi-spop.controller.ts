import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { CreateTransaksiDto } from './dto/create-transaksi.dto.js';
import { VerifikasiTransaksiDto } from './dto/verifikasi-transaksi.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('transaksi-spop')
@UseGuards(JwtAuthGuard)
export class TransaksiSpopController {
  constructor(private readonly transaksiSpopService: TransaksiSpopService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('DESA') // Only Desa can submit
  async create(@Body() createDto: CreateTransaksiDto, @Request() req: any) {
    return {
      success: true,
      message: 'SPOP berhasil disubmit',
      data: await this.transaksiSpopService.create(createDto, req.user.id_user),
    };
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return {
      success: true,
      data: await this.transaksiSpopService.getStats(req.user.role, req.user.id_user),
    };
  }

  @Get()
  async findAll(@Query('status') status: string, @Query('search') search: string, @Request() req: any) {
    return {
      success: true,
      data: await this.transaksiSpopService.findAll({
        status,
        search,
        role: req.user.role,
        userId: req.user.id_user,
      }),
    };
  }

  @Patch(':id/verifikasi')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA') // Only Bakeuda can verify
  async verifikasi(@Param('id') id: string, @Body() verifikasiDto: VerifikasiTransaksiDto, @Request() req: any) {
    return {
      success: true,
      message: 'Status verifikasi berhasil diupdate',
      data: await this.transaksiSpopService.verifikasi(id, verifikasiDto, req.user.id_user),
    };
  }
}
