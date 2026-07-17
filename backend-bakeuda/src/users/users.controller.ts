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
import { UsersService } from './users.service.js';
import { CreatePetugasDto } from './dto/create-petugas.dto.js';
import { UpdatePetugasDto } from './dto/update-petugas.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ActivitiesService } from '../activities/activities.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BAKEUDA')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPetugas(@Request() req: any, @Body() dto: CreatePetugasDto) {
    const result = await this.usersService.createPetugas(dto);
    await this.activitiesService.logActivity(req.user.id_user, 'create', `Menambahkan akun desa: ${dto.username}`);
    return result;
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
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePetugasDto,
  ) {
    const result = await this.usersService.updatePetugas(id, dto);
    await this.activitiesService.logActivity(req.user.id_user, 'update', 'Memperbarui informasi akun desa');
    return result;
  }

  @Delete(':id')
  async deletePetugas(@Request() req: any, @Param('id') id: string) {
    const result = await this.usersService.deletePetugas(id);
    await this.activitiesService.logActivity(req.user.id_user, 'delete', 'Menghapus akun desa');
    return result;
  }
}
