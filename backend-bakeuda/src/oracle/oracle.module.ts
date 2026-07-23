import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module.js';
import { OracleService } from './oracle.service.js';
import { OracleSyncService } from './oracle-sync.service.js';
import { OracleWriteService } from './oracle-write.service.js';
import { OracleSyncController } from './oracle-sync.controller.js';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [OracleSyncController],
  providers: [OracleService, OracleSyncService, OracleWriteService],
  exports: [OracleService, OracleSyncService, OracleWriteService],
})
export class OracleModule {}
