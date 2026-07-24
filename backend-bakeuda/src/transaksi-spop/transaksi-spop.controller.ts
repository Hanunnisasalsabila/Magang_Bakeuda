import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, UseGuards, Request, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { TransaksiSpopService } from './transaksi-spop.service.js';
import { SubmitTransaksiDto } from './dto/submit-transaksi.dto.js';
import { VerifikasiBakeudaDto } from './dto/verifikasi-bakeuda.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('transaksi-spop')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransaksiSpopController {
  constructor(private readonly service: TransaksiSpopService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitDraft(@Body() dto: SubmitTransaksiDto, @Request() req: any) {
    return this.service.submitPengajuan(dto, req.user, true); // DRAFT
  }

  @Post('draft/:id')
  async saveDraft(@Param('id') id: string, @Body() dto: SubmitTransaksiDto, @Request() req: any) {
    return this.service.saveDraft(id, dto, req.user);
  }

  @Delete(':id')
  async deleteDraft(@Param('id') id: string, @Request() req: any) {
    return this.service.deleteDraft(id, req.user);
  }

  @Post(':id/submit')
  async submitFinal(@Param('id') id: string, @Request() req: any) {
    return this.service.finalisasiSubmit(id, req.user); // DRAFT -> MENUNGGU
  }

  @Get()
  async list(@Query() query: any, @Request() req: any) {
    return this.service.list(query, req.user);
  }

  @Get('stats')
  async stats(@Query('kode_wilayah') kode_wilayah: string, @Request() req: any) {
    // If DESA, limit to their own stats
    const wil = req.user.role === 'DESA' ? req.user.kode_wilayah : kode_wilayah;
    return this.service.getStats(wil);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Request() req: any) {
    return this.service.getDetail(id, req.user);
  }

  @Post(':id/lock')
  @Roles('BAKEUDA')
  async lock(@Param('id') id: string, @Request() req: any) {
    return this.service.lockForReview(id, req.user);
  }

  @Post(':id/unlock')
  @Roles('BAKEUDA')
  async unlock(@Param('id') id: string, @Request() req: any) {
    return this.service.unlockReview(id, req.user);
  }

  @Post(':id/approve')
  @Roles('BAKEUDA')
  async approve(@Param('id') id: string, @Body() dto: VerifikasiBakeudaDto, @Request() req: any) {
    return this.service.approve(id, dto, req.user);
  }

  @Post(':id/tolak')
  @Roles('BAKEUDA')
  async tolak(@Param('id') id: string, @Body('catatan') catatan: string, @Request() req: any) {
    if (!catatan) throw new BadRequestException('Catatan penolakan harus diisi');
    return this.service.tolak(id, catatan, req.user);
  }

  @Post(':id/revisi')
  @Roles('BAKEUDA')
  async revisi(@Param('id') id: string, @Body('catatan') catatan: string, @Request() req: any) {
    if (!catatan) throw new BadRequestException('Catatan revisi harus diisi');
    return this.service.mintaRevisi(id, catatan, req.user);
  }

  @Post(':id/kembalikan-draft')
  async kembalikanDraft(@Param('id') id: string, @Request() req: any) {
    return this.service.kembalikanKeDraft(id, req.user);
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
    if (!file) throw new BadRequestException('File tidak ditemukan');
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    return { url_file: fileUrl };
  }

}
