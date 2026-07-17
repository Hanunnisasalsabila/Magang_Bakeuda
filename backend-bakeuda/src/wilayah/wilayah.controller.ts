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
import { WilayahService } from './wilayah.service.js';
import { CreateWilayahDto } from './dto/create-wilayah.dto.js';
import { UpdateWilayahDto } from './dto/update-wilayah.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ActivitiesService } from '../activities/activities.service.js';

@Controller('wilayah')
@UseGuards(JwtAuthGuard)
export class WilayahController {
  constructor(
    private readonly wilayahService: WilayahService,
    private readonly activitiesService: ActivitiesService,
  ) {}

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
  async create(@Request() req: any, @Body() dto: CreateWilayahDto) {
    const result = await this.wilayahService.create(dto);
    await this.activitiesService.logActivity(req.user.id_user, 'create', `Menambahkan wilayah: ${dto.nama_desa}`);
    return result;
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
  async update(@Request() req: any, @Param('kode') kode: string, @Body() dto: UpdateWilayahDto) {
    const result = await this.wilayahService.update(kode, dto);
    await this.activitiesService.logActivity(req.user.id_user, 'update', `Memperbarui wilayah: ${dto.nama_desa}`);
    return result;
  }

  // DELETE /wilayah/:kode — hanya BAKEUDA
  @Delete(':kode')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async delete(@Request() req: any, @Param('kode') kode: string) {
    const result = await this.wilayahService.delete(kode);
    await this.activitiesService.logActivity(req.user.id_user, 'delete', `Menghapus wilayah dengan kode: ${kode}`);
    return result;
  }
}
