import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ObjekPajakService } from './objek-pajak.service.js';
import { CreateObjekPajakDto } from './dto/create-objek-pajak.dto.js';
import { UpdateObjekPajakDto } from './dto/update-objek-pajak.dto.js';
import { UpdateObjekBumiDto } from './dto/update-objek-bumi.dto.js';
import { UpdateObjekBangunanDto } from './dto/update-objek-bangunan.dto.js';
import { UpdateFasilitasBangunanDto } from './dto/update-fasilitas-bangunan.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { KLASIFIKASI_BANGUNAN_META } from './objek-pajak-meta.constants.js';

@Controller('objek-pajak')
@UseGuards(JwtAuthGuard)
export class ObjekPajakController {
  constructor(private readonly objekPajakService: ObjekPajakService) {}

  // ─────────────────────────────────────────
  // PENTING: Route statis harus SEBELUM route dinamis (:nop)
  // ─────────────────────────────────────────

  // PUT /objek-pajak/bumi/:idBumi — hanya BAKEUDA
  @Put('bumi/:idBumi')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async updateBumi(
    @Param('idBumi') idBumi: string,
    @Body() dto: UpdateObjekBumiDto,
  ) {
    return this.objekPajakService.updateBumi(idBumi, dto);
  }

  // PUT /objek-pajak/bangunan/:idBangunan — hanya BAKEUDA
  @Put('bangunan/:idBangunan')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async updateBangunan(
    @Param('idBangunan') idBangunan: string,
    @Body() dto: UpdateObjekBangunanDto,
  ) {
    return this.objekPajakService.updateBangunan(idBangunan, dto);
  }

  // PUT /objek-pajak/bangunan/:idBangunan/fasilitas — hanya BAKEUDA
  @Put('bangunan/:idBangunan/fasilitas')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async updateFasilitas(
    @Param('idBangunan') idBangunan: string,
    @Body() dto: UpdateFasilitasBangunanDto,
  ) {
    return this.objekPajakService.updateFasilitasBangunan(idBangunan, dto);
  }

  // POST /objek-pajak/bangunan/:idBangunan/hitung-njop — hanya BAKEUDA
  @Post('bangunan/:idBangunan/hitung-njop')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async hitungNjopBangunan(@Param('idBangunan') idBangunan: string) {
    return this.objekPajakService.hitungUlangNjopBangunan(idBangunan);
  }

  // ─────────────────────────────────────────
  // Route dinamis (:nop) — setelah statis
  // ─────────────────────────────────────────

  // GET /objek-pajak/meta/enums
  @Get('meta/enums')
  async getEnumMeta() {
    return { success: true, data: KLASIFIKASI_BANGUNAN_META };
  }

  // GET /objek-pajak/stats
  @Get('stats')
  async getStats(@Request() req: any) {
    return this.objekPajakService.getStats(req.user);
  }

  // GET /objek-pajak?q=keyword
  @Get()
  async search(@Query('q') keyword: string, @Request() req: any) {
    return this.objekPajakService.search(keyword ?? '', req.user);
  }

  // POST /objek-pajak — semua role
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateObjekPajakDto, @Request() req: any) {
    return this.objekPajakService.create(dto, req.user);
  }

  // GET /objek-pajak/:nop
  @Get(':nop')
  async getByNop(@Param('nop') nop: string, @Request() req: any) {
    return this.objekPajakService.getByNop(nop, req.user);
  }

  // PUT /objek-pajak/:nop — hanya BAKEUDA (update NJOP & data objek)
  @Put(':nop')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async update(
    @Param('nop') nop: string,
    @Body() dto: UpdateObjekPajakDto,
    @Request() req: any,
  ) {
    return this.objekPajakService.update(nop, dto, req.user);
  }

  // DELETE /objek-pajak/:nop — hanya BAKEUDA (nonaktifkan NOP)
  @Delete(':nop')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async nonaktifkan(@Param('nop') nop: string, @Request() req: any) {
    return this.objekPajakService.nonaktifkan(nop, req.user);
  }
}
