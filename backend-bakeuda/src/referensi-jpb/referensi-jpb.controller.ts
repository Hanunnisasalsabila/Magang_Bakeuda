import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReferensiJpbService } from './referensi-jpb.service.js';
import { CreateReferensiJpbDto } from './dto/create-referensi-jpb.dto.js';
import { UpdateReferensiJpbDto } from './dto/update-referensi-jpb.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('referensi-jpb')
@UseGuards(JwtAuthGuard)
export class ReferensiJpbController {
  constructor(private readonly referensiJpbService: ReferensiJpbService) {}

  // GET /referensi-jpb — semua role, untuk isi dropdown (hanya aktif)
  @Get()
  async findAllActive() {
    return this.referensiJpbService.findAllActive();
  }

  // GET /referensi-jpb/all — BAKEUDA, termasuk yang nonaktif
  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async findAll() {
    return this.referensiJpbService.findAll();
  }

  // POST /referensi-jpb — BAKEUDA only
  @Post()
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateReferensiJpbDto) {
    return this.referensiJpbService.create(dto);
  }

  // PUT /referensi-jpb/:kode — BAKEUDA only
  @Put(':kode')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async update(
    @Param('kode') kode: string,
    @Body() dto: UpdateReferensiJpbDto,
  ) {
    return this.referensiJpbService.update(kode, dto);
  }

  // DELETE /referensi-jpb/:kode — BAKEUDA only (soft-delete / nonaktifkan)
  @Delete(':kode')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async deactivate(@Param('kode') kode: string) {
    return this.referensiJpbService.deactivate(kode);
  }
}
