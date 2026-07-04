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
} from '@nestjs/common';
import { WilayahService } from './wilayah.service.js';
import { CreateWilayahDto } from './dto/create-wilayah.dto.js';
import { UpdateWilayahDto } from './dto/update-wilayah.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('wilayah')
@UseGuards(JwtAuthGuard)
export class WilayahController {
  constructor(private readonly wilayahService: WilayahService) {}

  // GET /wilayah?kecamatan=...&kabupaten=...
  @Get()
  async getAll(
    @Query('kecamatan') kecamatan?: string,
    @Query('kabupaten') kabupaten?: string,
  ) {
    return this.wilayahService.getAll({ kecamatan, kabupaten });
  }

  // POST /wilayah — hanya BAKEUDA
  @Post()
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateWilayahDto) {
    return this.wilayahService.create(dto);
  }

  // GET /wilayah/:kode
  @Get(':kode')
  async getByKode(@Param('kode') kode: string) {
    return this.wilayahService.getByKode(kode);
  }

  // PUT /wilayah/:kode — hanya BAKEUDA
  @Put(':kode')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async update(@Param('kode') kode: string, @Body() dto: UpdateWilayahDto) {
    return this.wilayahService.update(kode, dto);
  }

  // DELETE /wilayah/:kode — hanya BAKEUDA
  @Delete(':kode')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async delete(@Param('kode') kode: string) {
    return this.wilayahService.delete(kode);
  }
}
