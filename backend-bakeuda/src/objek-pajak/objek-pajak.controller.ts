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

  // ─────────────────────────────────────────
  // Route dinamis (:nop) — setelah statis
  // ─────────────────────────────────────────

  // GET /objek-pajak?q=keyword
  @Get()
  async search(@Query('q') keyword?: string) {
    return this.objekPajakService.search(keyword ?? '');
  }

  // POST /objek-pajak — semua role
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateObjekPajakDto) {
    return this.objekPajakService.create(dto);
  }

  // GET /objek-pajak/:nop
  @Get(':nop')
  async getByNop(@Param('nop') nop: string) {
    return this.objekPajakService.getByNop(nop);
  }

  // PUT /objek-pajak/:nop — hanya BAKEUDA (update NJOP & data objek)
  @Put(':nop')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async update(
    @Param('nop') nop: string,
    @Body() dto: UpdateObjekPajakDto,
  ) {
    return this.objekPajakService.update(nop, dto);
  }

  // DELETE /objek-pajak/:nop — hanya BAKEUDA (nonaktifkan NOP)
  @Delete(':nop')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async nonaktifkan(@Param('nop') nop: string, @Request() req: any) {
    return this.objekPajakService.nonaktifkan(nop, req.user.id_user);
  }
}
