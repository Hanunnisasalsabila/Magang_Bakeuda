import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { SpptService } from './sppt.service.js';
import { GenerateSpptDto } from './dto/generate-sppt.dto.js';
import { BayarSpptDto } from './dto/bayar-sppt.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('sppt')
@UseGuards(JwtAuthGuard)
export class SpptController {
  constructor(private readonly spptService: SpptService) {}

  // ─────────────────────────────────────────
  // PENTING: Route statis (/generate) harus SEBELUM route dinamis (/:id)
  // ─────────────────────────────────────────

  // POST /sppt/generate — hanya BAKEUDA
  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  @HttpCode(HttpStatus.CREATED)
  async generate(@Body() dto: GenerateSpptDto, @Request() req: any) {
    const userId: string = req.user.id_user;
    if (dto.nop) {
      return this.spptService.generateSatuan(dto.nop, dto.tahun_pajak, userId);
    }
    return this.spptService.generateMassal(dto.tahun_pajak, userId);
  }

  // ─────────────────────────────────────────
  // Route dinamis — setelah statis
  // ─────────────────────────────────────────

  // GET /sppt?nop=&tahun_pajak=&status_bayar=
  @Get()
  async search(
    @Query('nop') nop?: string,
    @Query('tahun_pajak') tahunPajak?: string,
    @Query('status_bayar') statusBayar?: string,
  ) {
    return this.spptService.search({
      nop,
      tahun_pajak: tahunPajak ? Number(tahunPajak) : undefined,
      status_bayar: statusBayar,
    });
  }

  // PATCH /sppt/:id/bayar — hanya BAKEUDA
  @Patch(':id/bayar')
  @UseGuards(RolesGuard)
  @Roles('BAKEUDA')
  async bayar(@Param('id') id: string, @Body() dto: BayarSpptDto) {
    const tglBayar = dto.tgl_bayar ? new Date(dto.tgl_bayar) : new Date();
    return this.spptService.updateStatusBayar(id, tglBayar);
  }
}
