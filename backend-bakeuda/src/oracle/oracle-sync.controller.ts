import { Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { OracleSyncService } from './oracle-sync.service.js';

@Controller('oracle/sync')
@UseGuards(JwtAuthGuard)
export class OracleSyncController {
  constructor(private readonly syncService: OracleSyncService) {}

  @Post('full')
  async triggerFullSync() {
    return await this.syncService.fullSync('MANUAL_API');
  }

  @Post('delta')
  async triggerDeltaSync(@Query('since') sinceStr?: string) {
    const since = sinceStr ? new Date(sinceStr) : undefined;
    return await this.syncService.deltaSync(since, 'MANUAL_API');
  }
}
