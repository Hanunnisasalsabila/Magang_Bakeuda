import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from './oracle.service.js';
import { mapPrismaSubjekToOracle } from './mappers/subjek-pajak.mapper.js';
import { mapPrismaObjekToOracle } from './mappers/objek-pajak.mapper.js';

@Injectable()
export class OracleWriteService {
  private readonly logger = new Logger(OracleWriteService.name);

  constructor(private readonly oracle: OracleService) {}

  /**
   * Helper untuk menggenerate INSERT statement dari object
   */
  private generateInsertSql(tableName: string, data: Record<string, unknown>): { sql: string, params: Record<string, unknown> } {
    const keys = Object.keys(data);
    const columns = keys.join(', ');
    const values = keys.map(k => `:${k}`).join(', ');
    
    return {
      sql: `INSERT INTO ${tableName} (${columns}) VALUES (${values})`,
      params: data,
    };
  }

  /**
   * Tulis Subjek Pajak (baru) ke Oracle
   */
  async writeSubjekPajak(prismaData: any) {
    this.logger.log(`Writing Subjek Pajak ${prismaData.nik} to Oracle...`);
    const oracleData = mapPrismaSubjekToOracle(prismaData);
    const { sql, params } = this.generateInsertSql('DAT_SUBJEK_PAJAK', oracleData);
    
    try {
      await this.oracle.execute(sql, params);
      return true;
    } catch (e) {
      this.logger.error(`Failed to write Subjek Pajak ${prismaData.nik} to Oracle`, e);
      throw e;
    }
  }

  /**
   * Tulis Objek Pajak (baru) ke Oracle
   */
  async writeObjekPajak(prismaData: any) {
    this.logger.log(`Writing Objek Pajak ${prismaData.nop} to Oracle...`);
    const oracleData = mapPrismaObjekToOracle(prismaData);
    const { sql, params } = this.generateInsertSql('DAT_OBJEK_PAJAK', oracleData);
    
    try {
      await this.oracle.execute(sql, params);
      return true;
    } catch (e) {
      this.logger.error(`Failed to write Objek Pajak ${prismaData.nop} to Oracle`, e);
      throw e;
    }
  }

  // TODO: Tambahkan update/delete operations jika diperlukan oleh Write-Through

}
