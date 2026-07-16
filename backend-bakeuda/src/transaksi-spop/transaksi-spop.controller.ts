import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { CreateSpopDto } from './dto/create-spop.dto.js';
import { CreateDraftDto } from './dto/create-draft.dto.js';
import { VerifikasiBakeudaDto } from './dto/verifikasi-bakeuda.dto.js';
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = randomUUID() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    return { url_file: fileUrl };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDraft(@Body() dto: CreateSpopDto, @Request() req: any) {
    return this.transaksiSpopService.createDraft(dto, req.user.id_user);
  }

  @Post('draft')
  @HttpCode(HttpStatus.CREATED)
  async saveDraft(@Body() dto: CreateDraftDto, @Request() req: any) {
    return this.transaksiSpopService.saveDraft(dto, req.user.id_user);
  }

  @Patch(':id/ajukan')
  async ajukanKeBakeuda(
    @Param('id') id_transaksi: string,
    @Request() req: any
  ) {
    const userWilayah = req.user.kode_wilayah; 
    return this.transaksiSpopService.ajukanKeBakeuda(id_transaksi, userWilayah);
  }

  @Patch(':id/verifikasi-bakeuda')
  async verifikasiBakeuda(
    @Param('id') id_transaksi: string,
    @Body() dto: VerifikasiBakeudaDto,
    @Request() req: any
  ) {
    const idVerifikator = req.user.id_user; 
    return this.transaksiSpopService.verifikasiBakeuda(id_transaksi, dto, idVerifikator);
  }
}
