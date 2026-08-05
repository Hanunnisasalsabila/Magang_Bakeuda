import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotifikasiService {
  private readonly logger = new Logger(NotifikasiService.name);

  constructor(private prisma: PrismaService) { }

  async findAllForUser(userId: string) {
    return this.prisma.notifikasi.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notifikasi.count({
      where: { user_id: userId, is_read: false },
    });
  }

  async create(data: { user_id: string; title: string; message: string; type?: string; reference_id?: string }) {
    return this.prisma.notifikasi.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        reference_id: data.reference_id,
      },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notifikasi.updateMany({
      where: { id, user_id: userId },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notifikasi.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  }

  // Membersihkan notifikasi yang sudah dibaca dan berumur lebih dari 30 hari
  // Berjalan secara otomatis setiap tengah malam (jam 00:00)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldNotifications() {
    this.logger.log('Menjalankan auto-cleanup notifikasi lama...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const result = await this.prisma.notifikasi.deleteMany({
        where: {
          is_read: true,
          created_at: {
            lt: thirtyDaysAgo,
          },
        },
      });
      if (result.count > 0) {
        this.logger.log(`Auto-cleanup selesai: ${result.count} notifikasi lama telah dihapus.`);
      }
    } catch (error) {
      this.logger.error('Gagal menjalankan auto-cleanup notifikasi', error);
    }
  }
}
