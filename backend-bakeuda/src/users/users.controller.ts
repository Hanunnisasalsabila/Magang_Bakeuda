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
import { UsersService } from './users.service.js';
import { CreatePetugasDto } from './dto/create-petugas.dto.js';
import { UpdatePetugasDto } from './dto/update-petugas.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BAKEUDA')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPetugas(@Body() dto: CreatePetugasDto) {
    return this.usersService.createPetugas(dto);
  }

  @Get()
  async searchUsers(@Query('username') username?: string) {
    return this.usersService.searchByUsername(username ?? '');
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  async updatePetugas(
    @Param('id') id: string,
    @Body() dto: UpdatePetugasDto,
  ) {
    return this.usersService.updatePetugas(id, dto);
  }

  @Delete(':id')
  async deletePetugas(@Param('id') id: string) {
    return this.usersService.deletePetugas(id);
  }
}
