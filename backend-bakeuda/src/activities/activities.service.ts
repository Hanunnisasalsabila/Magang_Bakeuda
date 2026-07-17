import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createActivityDto: CreateActivityDto) {
    return this.prisma.userActivity.create({
      data: {
        id_user: userId,
        type: createActivityDto.type,
        title: createActivityDto.title,
      },
    });
  }

  async logActivity(userId: string, type: string, title: string) {
    return this.prisma.userActivity.create({
      data: {
        id_user: userId,
        type,
        title,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.userActivity.findMany({
      where: { id_user: userId },
      orderBy: { created_at: 'desc' },
      take: 20,
    });
  }
}
