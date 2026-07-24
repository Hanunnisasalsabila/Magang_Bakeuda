import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { OracleService } from './oracle.service.js';
import { mapOracleSubjekToPrisma, OracleSubjekPajak } from './mappers/subjek-pajak.mapper.js';
import { mapOracleObjekToPrisma, OracleObjekPajak } from './mappers/objek-pajak.mapper.js';
import { mapOracleBumiToPrisma, OracleObjekBumi } from './mappers/objek-bumi.mapper.js';
import { mapOracleBangunanToPrisma, OracleObjekBangunan } from './mappers/objek-bangunan.mapper.js';
import { mapOracleWilayahToPrisma, OracleWilayahRow } from './mappers/wilayah-ref.mapper.js';
import { mapOracleRefJpbToPrisma, OracleRefJpb } from './mappers/ref-jpb.mapper.js';
import { mapOracleFasilitasToPrisma, OracleFasilitasRow } from './mappers/fasilitas-bangunan.mapper.js';

@Injectable()
export class OracleSyncService implements OnModuleInit {
  private readonly logger = new Logger(OracleSyncService.name);
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly oracle: OracleService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const isEnabled = this.config.get<string>('ORACLE_SYNC_ENABLED') === 'true';
    if (!isEnabled) {
      this.logger.log('Oracle Sync is disabled via ORACLE_SYNC_ENABLED=false');
      return;
    }

    const intervalMs = parseInt(this.config.get<string>('ORACLE_SYNC_INTERVAL_MS') || '300000', 10);
    this.logger.log(`Starting Oracle background sync with interval ${intervalMs}ms`);
    
    // First run after 30 seconds
    setTimeout(() => {
      this.runPeriodicSync().catch(e => this.logger.error('Initial sync failed', e));
      
      this.syncInterval = setInterval(() => {
        this.runPeriodicSync().catch(e => this.logger.error('Periodic sync failed', e));
      }, intervalMs);
    }, 30000);
  }

  /**
   * Main periodic sync runner
   */
  async runPeriodicSync() {
    try {
      const isConnected = await this.oracle.healthCheck();
      if (!isConnected) {
        this.logger.warn('Oracle is unreachable, skipping sync');
        return;
      }

      this.logger.log('Running periodic delta sync...');
      
      // Hitung kapan terakhir sukses sync untuk setiap tabel
      const sinceDate = await this.getLastSyncTime('ALL'); 
      
      await this.deltaSync(sinceDate);
      await this.backfillSync();
      
    } catch (error) {
      this.logger.error('Failed to run periodic sync', error);
    }
  }

  /**
   * Helper to get last successful sync time
   */
  private async getLastSyncTime(tableName: string): Promise<Date | undefined> {
    const log = await this.prisma.syncLog.findFirst({
      where: { 
        status: 'SUCCESS',
        ...(tableName !== 'ALL' ? { table_name: tableName } : {})
      },
      orderBy: { started_at: 'desc' },
    });
    
    // Jika tidak pernah sync, ambil dari 30 hari yang lalu (atau bisa full-sync)
    if (!log) {
       const thirtyDaysAgo = new Date();
       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
       return thirtyDaysAgo;
    }
    
    return log.started_at;
  }

  /**
   * Log sync process
   */
  private async createSyncLog(tableName: string, syncType: string, triggeredBy: string = 'SYSTEM') {
    return this.prisma.syncLog.create({
      data: {
        table_name: tableName,
        sync_type: syncType,
        status: 'IN_PROGRESS',
        triggered_by: triggeredBy,
      }
    });
  }

  private async finalizeSyncLog(id: string, rowsSynced: number, error?: any, nextOffset?: number) {
    await this.prisma.syncLog.update({
      where: { id },
      data: {
        status: error ? 'FAILED' : (nextOffset === -1 ? 'FINISHED' : 'SUCCESS'),
        completed_at: new Date(),
        rows_synced: rowsSynced,
        error_message: error ? (error.message || error.toString()).substring(0, 500) : (nextOffset !== undefined ? `OFFSET:${nextOffset}` : null),
      }
    });
  }


  // ==========================================
  // SYNC OPERATIONS
  // ==========================================

  async fullSync(triggeredBy: string = 'MANUAL') {
    this.logger.log(`Starting FULL SYNC triggered by ${triggeredBy}`);
    
    try {
      await this.syncSektor(triggeredBy);
      await this.syncWilayah(triggeredBy);
      await this.syncRefJpb(triggeredBy);
      await this.syncSubjekPajak(undefined, triggeredBy);
      await this.syncObjekPajak(undefined, triggeredBy);
      await this.syncObjekBumi(undefined, triggeredBy);
      await this.syncObjekBangunan(undefined, triggeredBy);
      await this.syncFasilitasBangunan(triggeredBy);
      
      this.logger.log('FULL SYNC COMPLETED SUCCESSFULLY');
      return { success: true, message: 'Full sync completed' };
    } catch (e) {
      this.logger.error('Full sync failed', e);
      throw e;
    }
  }

  async deltaSync(since?: Date, triggeredBy: string = 'SYSTEM') {
    this.logger.log(`Starting DELTA SYNC since ${since ? since.toISOString() : 'beginning'} triggered by ${triggeredBy}`);
    
    try {
      // Subjek pajak selalu scan semua (karena tidak ada timestamp) tapi batch limit
      await this.syncSubjekPajak(undefined, triggeredBy); 
      
      await this.syncObjekPajak(since, triggeredBy);
      await this.syncObjekBumi(since, triggeredBy);
      await this.syncObjekBangunan(since, triggeredBy);
      
      return { success: true, message: 'Delta sync completed' };
    } catch (e) {
      this.logger.error('Delta sync failed', e);
      throw e;
    }
  }

  private async getBackfillOffset(tableName: string): Promise<number | 'FINISHED'> {
    const finished = await this.prisma.syncLog.findFirst({
      where: { table_name: tableName, sync_type: 'BACKFILL', status: 'FINISHED' }
    });
    if (finished) return 'FINISHED';

    const lastLog = await this.prisma.syncLog.findFirst({
      where: { table_name: tableName, sync_type: 'BACKFILL', status: 'SUCCESS' },
      orderBy: { completed_at: 'desc' }
    });
    
    if (lastLog && lastLog.error_message && lastLog.error_message.startsWith('OFFSET:')) {
      return parseInt(lastLog.error_message.split(':')[1], 10);
    }
    return 0;
  }

  async backfillSync(triggeredBy: string = 'SYSTEM') {
    const tables = [
      'DAT_SUBJEK_PAJAK',
      'DAT_OBJEK_PAJAK',
      'DAT_OP_BUMI',
      'DAT_OP_BANGUNAN',
      'DAT_FASILITAS_BANGUNAN'
    ];

    for (const table of tables) {
      const offset = await this.getBackfillOffset(table);
      if (offset === 'FINISHED') continue;
      
      this.logger.log(`[BACKFILL] Starting ${table} at offset ${offset}`);
      try {
        switch (table) {
          case 'DAT_SUBJEK_PAJAK':
            await this.syncSubjekPajak(undefined, triggeredBy, true, offset as number); break;
          case 'DAT_OBJEK_PAJAK':
            await this.syncObjekPajak(undefined, triggeredBy, true, offset as number); break;
          case 'DAT_OP_BUMI':
            await this.syncObjekBumi(undefined, triggeredBy, true, offset as number); break;
          case 'DAT_OP_BANGUNAN':
            await this.syncObjekBangunan(undefined, triggeredBy, true, offset as number); break;
          case 'DAT_FASILITAS_BANGUNAN':
            await this.syncFasilitasBangunan(triggeredBy, true, offset as number); break;
        }
      } catch (e) {
        this.logger.error(`[BACKFILL] Failed at ${table} offset ${offset}`, e);
      }
    }
    this.logger.log('[BACKFILL] Backfill cycle finished for all tables!');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleAutomaticBackfill() {
    this.logger.log('Running automatic backfill via Cron (Every 30 Minutes)');
    await this.backfillSync('CRON');
  }


  // ==========================================
  // SPECIFIC TABLE SYNC
  // ==========================================

  async syncWilayah(triggeredBy: string = 'SYSTEM') {
    const log = await this.createSyncLog('REF_WILAYAH', 'FULL', triggeredBy);
    try {
      const sql = `
        SELECT
          k.KD_PROPINSI || k.KD_DATI2 || k.KD_KECAMATAN || l.KD_KELURAHAN AS KODE_WILAYAH,
          k.KD_PROPINSI AS KODE_PROPINSI,
          k.KD_DATI2 AS KODE_DATI2,
          k.KD_KECAMATAN AS KODE_KECAMATAN,
          l.KD_KELURAHAN AS KODE_KELURAHAN,
          p.NM_PROPINSI, 
          d.NM_DATI2, 
          k.NM_KECAMATAN, 
          l.NM_KELURAHAN, 
          l.KD_SEKTOR
        FROM REF_KELURAHAN l
        JOIN REF_KECAMATAN k ON l.KD_PROPINSI=k.KD_PROPINSI AND l.KD_DATI2=k.KD_DATI2 AND l.KD_KECAMATAN=k.KD_KECAMATAN
        JOIN REF_DATI2 d ON l.KD_PROPINSI=d.KD_PROPINSI AND l.KD_DATI2=d.KD_DATI2
        JOIN REF_PROPINSI p ON l.KD_PROPINSI=p.KD_PROPINSI
      `;
      
      const rows = await this.oracle.query<OracleWilayahRow>(sql);
      this.logger.log(`[REF_WILAYAH] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);
      
      let count = 0;
      for (const row of rows) {
        const data = mapOracleWilayahToPrisma(row);
        await this.prisma.wilayah.upsert({
          where: { kode_wilayah: data.kode_wilayah },
          update: data,
          create: data,
        });
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[REF_WILAYAH] Synced ${count} / ${rows.length} records...`);
        }
      }
      
      this.logger.log(`[REF_WILAYAH] Finished syncing ${count} records.`);
      await this.finalizeSyncLog(log.id, count);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncSektor(triggeredBy: string = 'SYSTEM') {
    const log = await this.createSyncLog('REF_JNS_SEKTOR', 'FULL', triggeredBy);
    try {
      const rows = await this.oracle.query<{ KD_SEKTOR: string; NM_SEKTOR: string }>('SELECT * FROM REF_JNS_SEKTOR');
      let count = 0;
      for (const row of rows) {
        if (!row.KD_SEKTOR) continue;
        await this.prisma.sektor.upsert({
          where: { kode_sektor: row.KD_SEKTOR },
          update: { nama_sektor: row.NM_SEKTOR || 'UNKNOWN' },
          create: { kode_sektor: row.KD_SEKTOR, nama_sektor: row.NM_SEKTOR || 'UNKNOWN' },
        });
        count++;
      }
      await this.finalizeSyncLog(log.id, count);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncRefJpb(triggeredBy: string = 'SYSTEM') {
    const log = await this.createSyncLog('REF_JPB', 'FULL', triggeredBy);
    try {
      const sql = `SELECT * FROM REF_JPB`;
      const rows = await this.oracle.query<OracleRefJpb>(sql);
      this.logger.log(`[REF_JPB] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);

      let count = 0;
      for (const row of rows) {
        if (!row.KD_JPB) continue;
        const data = mapOracleRefJpbToPrisma(row);
        
        await this.prisma.referensiJenisPenggunaanBangunan.upsert({
          where: { kode_jpb: data.kode_jpb },
          update: data,
          create: data,
        });
        count++;
      }
      this.logger.log(`[REF_JPB] Finished syncing ${count} records.`);
      await this.finalizeSyncLog(log.id, count);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncSubjekPajak(since?: Date, triggeredBy: string = 'SYSTEM', isBackfill: boolean = false, offset: number = 0) {
    const syncType = isBackfill ? 'BACKFILL' : (since ? 'DELTA' : 'FULL');
    const log = await this.createSyncLog('DAT_SUBJEK_PAJAK', syncType, triggeredBy);
    try {
      let sql = '';
      const params: any = {};
      
      if (isBackfill) {
        sql = 'SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM DAT_SUBJEK_PAJAK ORDER BY SUBJEK_PAJAK_ID ASC NULLS LAST) a WHERE ROWNUM <= :maxRow) WHERE rnum > :offset';
        params.offset = offset;
        params.maxRow = offset + 5000;
      } else {
        sql = 'SELECT * FROM (SELECT * FROM DAT_SUBJEK_PAJAK) WHERE ROWNUM <= 5000';
      }
      
      const rows = await this.oracle.query<OracleSubjekPajak>(sql, params);
      this.logger.log(`[DAT_SUBJEK_PAJAK] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);

      let fallbackWilayah = '3303000000';
      const defaultWilayah = await this.prisma.wilayah.findFirst();
      if (defaultWilayah) {
        fallbackWilayah = defaultWilayah.kode_wilayah;
      }
      
      let fallbackUserId = 'SYSTEM_ORACLE_SYNC';
      const defaultUser = await this.prisma.user.findFirst();
      if (defaultUser) {
        fallbackUserId = defaultUser.id_user;
      }
      
      let count = 0;
      for (const row of rows) {
        const data = mapOracleSubjekToPrisma(row, fallbackWilayah, fallbackUserId); // default fallback
        if (!data.nik) continue;
        
        try {
          await this.prisma.subjekPajak.upsert({
            where: { nik: data.nik },
            update: data,
            create: data,
          });
        } catch (e: any) {
          if (e.code === 'P2003') {
            data.kode_wilayah = fallbackWilayah;
            await this.prisma.subjekPajak.upsert({
              where: { nik: data.nik },
              update: data,
              create: data,
            });
          } else {
            throw e;
          }
        }
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[DAT_SUBJEK_PAJAK] Synced ${count} / ${rows.length} records...`);
        }
      }
      
      this.logger.log(`[DAT_SUBJEK_PAJAK] Finished syncing ${count} records.`);
      
      const nextOffset = isBackfill ? (rows.length < 5000 ? -1 : offset + rows.length) : undefined;
      await this.finalizeSyncLog(log.id, count, undefined, nextOffset);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncObjekPajak(since?: Date, triggeredBy: string = 'SYSTEM', isBackfill: boolean = false, offset: number = 0) {
    const syncType = isBackfill ? 'BACKFILL' : (since ? 'DELTA' : 'FULL');
    const log = await this.createSyncLog('DAT_OBJEK_PAJAK', syncType, triggeredBy);
    try {
      let sql = '';
      const params: any = {};
      
      if (isBackfill) {
         sql = 'SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM DAT_OBJEK_PAJAK ORDER BY TGL_PEREKAMAN_OP ASC NULLS LAST) a WHERE ROWNUM <= :maxRow) WHERE rnum > :offset';
         params.offset = offset;
         params.maxRow = offset + 5000;
      } else if (since) {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OBJEK_PAJAK WHERE TGL_PEREKAMAN_OP >= :since OR TGL_PENDATAAN_OP >= :since ORDER BY TGL_PEREKAMAN_OP DESC NULLS LAST) WHERE ROWNUM <= 5000';
        params.since = since;
      } else {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OBJEK_PAJAK ORDER BY TGL_PEREKAMAN_OP DESC NULLS LAST) WHERE ROWNUM <= 5000'; // 5000 TERBARU
      }
      
      const rows = await this.oracle.query<OracleObjekPajak>(sql, params);
      this.logger.log(`[DAT_OBJEK_PAJAK] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);

      let fallbackNik = '3303000000000000';
      const defaultSubjek = await this.prisma.subjekPajak.findFirst();
      if (defaultSubjek) {
        fallbackNik = defaultSubjek.nik;
      }
      
      let count = 0;
      for (const row of rows) {
        const data = mapOracleObjekToPrisma(row, fallbackNik); // default fallback NIK
        if (!data.nop) continue;
        
        try {
          await this.prisma.objekPajak.upsert({
            where: { nop: data.nop },
            update: data,
            create: data,
          });
        } catch (e: any) {
          if (e.code === 'P2003') {
            try {
              data.nik_subjek = fallbackNik;
              await this.prisma.objekPajak.upsert({
                where: { nop: data.nop },
                update: data,
                create: data,
              });
            } catch (innerErr) {
              this.logger.warn(`[DAT_OBJEK_PAJAK] Skipping NOP ${data.nop} due to FK error even with fallback.`);
            }
          } else {
            this.logger.error(`[DAT_OBJEK_PAJAK] Error on NOP ${data.nop}:`, e);
          }
        }
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[DAT_OBJEK_PAJAK] Synced ${count} / ${rows.length} records...`);
        }
      }
      
      this.logger.log(`[DAT_OBJEK_PAJAK] Finished syncing ${count} records.`);
      const nextOffset = isBackfill ? (rows.length < 5000 ? -1 : offset + rows.length) : undefined;
      await this.finalizeSyncLog(log.id, count, undefined, nextOffset);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncObjekBumi(since?: Date, triggeredBy: string = 'SYSTEM', isBackfill: boolean = false, offset: number = 0) {
    const syncType = isBackfill ? 'BACKFILL' : (since ? 'DELTA' : 'FULL');
    const log = await this.createSyncLog('DAT_OP_BUMI', syncType, triggeredBy);
    try {
      let sql = '';
      const params: any = {};

      if (isBackfill) {
        sql = 'SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM DAT_OP_BUMI ORDER BY TGL_UPDATE ASC NULLS LAST) a WHERE ROWNUM <= :maxRow) WHERE rnum > :offset';
        params.offset = offset;
        params.maxRow = offset + 5000;
      } else if (since) {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OP_BUMI WHERE TGL_UPDATE >= :since ORDER BY TGL_UPDATE DESC NULLS LAST) WHERE ROWNUM <= 5000';
        params.since = since;
      } else {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OP_BUMI ORDER BY TGL_UPDATE DESC NULLS LAST) WHERE ROWNUM <= 5000'; // 5000 TERBARU
      }

      const rows = await this.oracle.query<OracleObjekBumi>(sql, params);
      this.logger.log(`[DAT_OP_BUMI] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);
      
      let count = 0;
      for (const row of rows) {
        const data = mapOracleBumiToPrisma(row);
        
        // Pastikan objek pajak induknya ada
        const parent = await this.prisma.objekPajak.findUnique({ where: { nop: data.nop } });
        if (!parent) continue; // Skip jika induk tidak ada
        
        await this.prisma.objekBumi.upsert({
          where: {
            nop_no_bumi: { nop: data.nop, no_bumi: data.no_bumi }
          },
          update: data,
          create: data,
        });
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[DAT_OP_BUMI] Synced ${count} / ${rows.length} records...`);
        }
      }
      
      this.logger.log(`[DAT_OP_BUMI] Finished syncing ${count} records.`);
      const nextOffset = isBackfill ? (rows.length < 5000 ? -1 : offset + rows.length) : undefined;
      await this.finalizeSyncLog(log.id, count, undefined, nextOffset);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncObjekBangunan(since?: Date, triggeredBy: string = 'SYSTEM', isBackfill: boolean = false, offset: number = 0) {
    const syncType = isBackfill ? 'BACKFILL' : (since ? 'DELTA' : 'FULL');
    const log = await this.createSyncLog('DAT_OP_BANGUNAN', syncType, triggeredBy);
    try {
      let sql = '';
      const params: any = {};

      if (isBackfill) {
        sql = 'SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM DAT_OP_BANGUNAN ORDER BY TGL_PEREKAMAN_BNG ASC NULLS LAST) a WHERE ROWNUM <= :maxRow) WHERE rnum > :offset';
        params.offset = offset;
        params.maxRow = offset + 5000;
      } else if (since) {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OP_BANGUNAN WHERE TGL_PEREKAMAN_BNG >= :since ORDER BY TGL_PEREKAMAN_BNG DESC NULLS LAST) WHERE ROWNUM <= 5000';
        params.since = since;
      } else {
        sql = 'SELECT * FROM (SELECT * FROM DAT_OP_BANGUNAN ORDER BY TGL_PEREKAMAN_BNG DESC NULLS LAST) WHERE ROWNUM <= 5000'; // 5000 TERBARU
      }

      const rows = await this.oracle.query<OracleObjekBangunan>(sql, params);
      this.logger.log(`[DAT_OP_BANGUNAN] Retrieved ${rows.length} rows from Oracle. Starting upsert...`);
      
      let count = 0;
      for (const row of rows) {
        const data = mapOracleBangunanToPrisma(row);
        
        // Pastikan objek pajak induknya ada
        const parent = await this.prisma.objekPajak.findUnique({ where: { nop: data.nop } });
        if (!parent) continue; // Skip jika induk tidak ada
        
        try {
          await this.prisma.objekBangunan.upsert({
            where: {
              nop_no_bangunan: { nop: data.nop, no_bangunan: data.no_bangunan }
            },
            update: data,
            create: data,
          });
        } catch (e: any) {
          if (e.code === 'P2003') {
            try {
              data.kode_jpb = null;
              await this.prisma.objekBangunan.upsert({
                where: {
                  nop_no_bangunan: { nop: data.nop, no_bangunan: data.no_bangunan }
                },
                update: data,
                create: data,
              });
            } catch (innerErr) {
              this.logger.warn(`[DAT_OP_BANGUNAN] Skipping NOP ${data.nop} NO ${data.no_bangunan} due to FK error.`);
            }
          } else {
            this.logger.error(`[DAT_OP_BANGUNAN] Error on NOP ${data.nop}:`, e);
          }
        }
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[DAT_OP_BANGUNAN] Synced ${count} / ${rows.length} records...`);
        }
      }
      
      this.logger.log(`[DAT_OP_BANGUNAN] Finished syncing ${count} records.`);
      const nextOffset = isBackfill ? (rows.length < 5000 ? -1 : offset + rows.length) : undefined;
      await this.finalizeSyncLog(log.id, count, undefined, nextOffset);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  async syncFasilitasBangunan(triggeredBy: string = 'SYSTEM', isBackfill: boolean = false, offset: number = 0) {
    const syncType = isBackfill ? 'BACKFILL' : 'FULL';
    const log = await this.createSyncLog('DAT_FASILITAS_BANGUNAN', syncType, triggeredBy);
    try {
      let sql = '';
      const params: any = {};
      
      if (isBackfill) {
        sql = 'SELECT * FROM (SELECT a.*, ROWNUM rnum FROM (SELECT * FROM DAT_FASILITAS_BANGUNAN ORDER BY KD_PROPINSI, KD_DATI2, KD_KECAMATAN, KD_KELURAHAN, KD_BLOK, NO_URUT, KD_JNS_OP, NO_BNG) a WHERE ROWNUM <= :maxRow) WHERE rnum > :offset';
        params.offset = offset;
        params.maxRow = offset + 5000;
      } else {
        sql = `SELECT * FROM DAT_FASILITAS_BANGUNAN`;
      }
      
      const rows = await this.oracle.query<OracleFasilitasRow>(sql, params);
      this.logger.log(`[DAT_FASILITAS_BANGUNAN] Retrieved ${rows.length} rows from Oracle. Grouping...`);

      // Group by NOP + NO_BNG
      const groups = new Map<string, OracleFasilitasRow[]>();
      for (const row of rows) {
        const nop = (row.KD_PROPINSI || '') + (row.KD_DATI2 || '') + (row.KD_KECAMATAN || '') + (row.KD_KELURAHAN || '') + (row.KD_BLOK || '') + (row.NO_URUT || '') + (row.KD_JNS_OP || '');
        const key = `${nop}_${row.NO_BNG}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      }

      this.logger.log(`[DAT_FASILITAS_BANGUNAN] Grouped into ${groups.size} buildings. Starting upsert...`);

      let count = 0;
      for (const [key, bngRows] of groups.entries()) {
        const [nop, noBngStr] = key.split('_');
        const no_bangunan = parseInt(noBngStr, 10);
        
        const bng = await this.prisma.objekBangunan.findUnique({
          where: { nop_no_bangunan: { nop, no_bangunan } },
          select: { id_bangunan: true }
        });
        
        if (!bng) continue; // Skip jika bangunan induk tidak ada di DB

        const data = mapOracleFasilitasToPrisma(bng.id_bangunan, bngRows);
        
        await this.prisma.objekBangunanFasilitas.upsert({
          where: { id_bangunan: bng.id_bangunan },
          update: data,
          create: data,
        });
        
        count++;
        if (count % 1000 === 0) {
          this.logger.log(`[DAT_FASILITAS_BANGUNAN] Synced ${count} / ${groups.size} records...`);
        }
      }

      this.logger.log(`[DAT_FASILITAS_BANGUNAN] Finished syncing ${count} records.`);
      const nextOffset = isBackfill ? (rows.length < 5000 ? -1 : offset + rows.length) : undefined;
      await this.finalizeSyncLog(log.id, count, undefined, nextOffset);
      return count;
    } catch (e) {
      await this.finalizeSyncLog(log.id, 0, e);
      throw e;
    }
  }

  // ==========================================
  // SYNC SINGLE NOP (LAZY LOADING)
  // ==========================================
  
  async syncSingleNop(nop: string): Promise<boolean> {
    this.logger.log(`[SYNC_SINGLE_NOP] NOP ${nop} not found in Postgres, querying Oracle...`);
    try {
      if (nop.length !== 18) return false;
      const p = {
        KD_PROPINSI: nop.substring(0, 2),
        KD_DATI2: nop.substring(2, 4),
        KD_KECAMATAN: nop.substring(4, 7),
        KD_KELURAHAN: nop.substring(7, 10),
        KD_BLOK: nop.substring(10, 13),
        NO_URUT: nop.substring(13, 17),
        KD_JNS_OP: nop.substring(17, 18)
      };
      const whereCond = `KD_PROPINSI = :KD_PROPINSI AND KD_DATI2 = :KD_DATI2 AND KD_KECAMATAN = :KD_KECAMATAN AND KD_KELURAHAN = :KD_KELURAHAN AND KD_BLOK = :KD_BLOK AND NO_URUT = :NO_URUT AND KD_JNS_OP = :KD_JNS_OP`;
      
      const opRows = await this.oracle.query<OracleObjekPajak>(`SELECT * FROM DAT_OBJEK_PAJAK WHERE ${whereCond}`, p);
      if (opRows.length === 0) {
        this.logger.log(`[SYNC_SINGLE_NOP] NOP ${nop} not found in Oracle either.`);
        return false;
      }
      const opRow = opRows[0];
      
      // 1. Sync Subjek Pajak
      const subjekId = opRow.SUBJEK_PAJAK_ID;
      if (subjekId) {
        const spRows = await this.oracle.query<OracleSubjekPajak>(`SELECT * FROM DAT_SUBJEK_PAJAK WHERE SUBJEK_PAJAK_ID = :id`, { id: subjekId });
        if (spRows.length > 0) {
           let fallbackWilayah = '3303000000';
           const defaultWilayah = await this.prisma.wilayah.findFirst();
           if (defaultWilayah) fallbackWilayah = defaultWilayah.kode_wilayah;
           let fallbackUserId = 'SYSTEM_ORACLE_SYNC';
           const defaultUser = await this.prisma.user.findFirst();
           if (defaultUser) fallbackUserId = defaultUser.id_user;
           
           const spData = mapOracleSubjekToPrisma(spRows[0], fallbackWilayah, fallbackUserId);
           if (spData.nik) {
             await this.prisma.subjekPajak.upsert({ where: { nik: spData.nik }, update: spData, create: spData });
           }
        }
      }

      // 2. Sync Objek Pajak
      let fallbackNik = '3303000000000000';
      const defaultSubjek = await this.prisma.subjekPajak.findFirst();
      if (defaultSubjek) fallbackNik = defaultSubjek.nik;
      
      const opData = mapOracleObjekToPrisma(opRow, fallbackNik);
      if (opData.nop) {
        try {
          await this.prisma.objekPajak.upsert({ where: { nop: opData.nop }, update: opData, create: opData });
        } catch (e: any) {
           if (e.code === 'P2003') {
             opData.nik_subjek = fallbackNik;
             await this.prisma.objekPajak.upsert({ where: { nop: opData.nop }, update: opData, create: opData });
           }
        }
      }
      
      // 3. Sync Bumi
      const bumiRows = await this.oracle.query<OracleObjekBumi>(`SELECT * FROM DAT_OP_BUMI WHERE ${whereCond}`, p);
      for (const row of bumiRows) {
        const data = mapOracleBumiToPrisma(row);
        await this.prisma.objekBumi.upsert({
          where: { nop_no_bumi: { nop: data.nop, no_bumi: data.no_bumi } },
          update: data, create: data
        });
      }
      
      // 4. Sync Bangunan
      const bngRows = await this.oracle.query<OracleObjekBangunan>(`SELECT * FROM DAT_OP_BANGUNAN WHERE ${whereCond}`, p);
      for (const row of bngRows) {
        const data = mapOracleBangunanToPrisma(row);
        try {
          await this.prisma.objekBangunan.upsert({
            where: { nop_no_bangunan: { nop: data.nop, no_bangunan: data.no_bangunan } },
            update: data, create: data
          });
        } catch (e: any) {
           if (e.code === 'P2003') {
             data.kode_jpb = null;
             await this.prisma.objekBangunan.upsert({
               where: { nop_no_bangunan: { nop: data.nop, no_bangunan: data.no_bangunan } },
               update: data, create: data
             });
           }
        }
      }
      
      // 5. Sync Fasilitas
      const fasRows = await this.oracle.query<OracleFasilitasRow>(`SELECT * FROM DAT_FASILITAS_BANGUNAN WHERE ${whereCond}`, p);
      if (fasRows.length > 0) {
        const groups = new Map<string, OracleFasilitasRow[]>();
        for (const row of fasRows) {
          const key = `${nop}_${row.NO_BNG}`;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(row);
        }
        for (const [key, bngFasRows] of groups.entries()) {
          const no_bangunan = parseInt(key.split('_')[1], 10);
          const bng = await this.prisma.objekBangunan.findUnique({
            where: { nop_no_bangunan: { nop, no_bangunan } },
            select: { id_bangunan: true }
          });
          if (bng) {
            const data = mapOracleFasilitasToPrisma(bng.id_bangunan, bngFasRows);
            await this.prisma.objekBangunanFasilitas.upsert({
              where: { id_bangunan: bng.id_bangunan },
              update: data, create: data
            });
          }
        }
      }
      
      this.logger.log(`[SYNC_SINGLE_NOP] Successfully synced NOP ${nop} from Oracle.`);
      return true;
    } catch (e) {
      this.logger.error(`[SYNC_SINGLE_NOP] Failed to sync single NOP ${nop}`, e);
      return false;
    }
  }

}
