import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('notifikasi')
@UseGuards(JwtAuthGuard)
export class NotifikasiController {
  constructor(private readonly notifikasiService: NotifikasiService) {}

  @Get()
  async getNotifikasi(@Request() req: any) {
    const userId = req.user.userId;
    const items = await this.notifikasiService.findAllForUser(userId);
    const unreadCount = await this.notifikasiService.countUnread(userId);
    
    return {
      success: true,
      data: {
        items,
        unreadCount,
      }
    };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user.userId;
    await this.notifikasiService.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    await this.notifikasiService.markAsRead(id, userId);
    return { success: true, message: 'Notification marked as read' };
  }
}
