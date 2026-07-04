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
  async search(@Query('q') keyword?: string) {
    return this.subjekPajakService.search(keyword ?? '');
  }

  // POST /subjek-pajak
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSubjekPajakDto, @Request() req: any) {
    return this.subjekPajakService.create(dto, req.user.id_user);
  }

  // GET /subjek-pajak/:nik
  @Get(':nik')
  async getByNik(@Param('nik') nik: string) {
    return this.subjekPajakService.getByNik(nik);
  }

  // PUT /subjek-pajak/:nik
  @Put(':nik')
  async update(
    @Param('nik') nik: string,
    @Body() dto: UpdateSubjekPajakDto,
  ) {
    return this.subjekPajakService.update(nik, dto);
  }

  // DELETE /subjek-pajak/:nik
  @Delete(':nik')
  async delete(@Param('nik') nik: string) {
    return this.subjekPajakService.delete(nik);
  }
}
