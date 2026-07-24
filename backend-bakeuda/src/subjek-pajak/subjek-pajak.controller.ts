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
import { SubjekPajakService } from './subjek-pajak.service.js';
import { CreateSubjekPajakDto } from './dto/create-subjek-pajak.dto.js';
import { UpdateSubjekPajakDto } from './dto/update-subjek-pajak.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('subjek-pajak')
@UseGuards(JwtAuthGuard)
export class SubjekPajakController {
  constructor(private readonly subjekPajakService: SubjekPajakService) {}

  // GET /subjek-pajak?q=keyword
  @Get()
  async search(@Query('q') keyword: string, @Request() req: any) {
    return this.subjekPajakService.search(keyword ?? '', req.user);
  }

  // POST /subjek-pajak
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSubjekPajakDto, @Request() req: any) {
    return this.subjekPajakService.create(dto, req.user);
  }

  // GET /subjek-pajak/find/detail?nik=... (Robust endpoint for complex NIKs like '.' or slashes)
  @Get('find/detail')
  async getByNikQuery(@Query('nik') nik: string, @Request() req: any) {
    return this.subjekPajakService.getByNik(nik, req.user);
  }

  // GET /subjek-pajak/:nik (Legacy endpoint)
  @Get(':nik')
  async getByNik(@Param('nik') nik: string, @Request() req: any) {
    return this.subjekPajakService.getByNik(nik, req.user);
  }

  // PUT /subjek-pajak/:nik
  @Put(':nik')
  async update(
    @Param('nik') nik: string,
    @Body() dto: UpdateSubjekPajakDto,
    @Request() req: any,
  ) {
    return this.subjekPajakService.update(nik, dto, req.user);
  }

  // DELETE /subjek-pajak/:nik
  @Delete(':nik')
  async delete(@Param('nik') nik: string, @Request() req: any) {
    return this.subjekPajakService.delete(nik, req.user);
  }
}
