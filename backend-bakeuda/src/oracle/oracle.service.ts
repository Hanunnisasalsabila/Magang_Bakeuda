import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OracleService.name);
  private oracledb: any;
  private pool: any;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    try {
      const oracledbModule = await import('oracledb');
      this.oracledb = oracledbModule.default || oracledbModule;

      // Karena Oracle Server versi lama (seperti 11g), kita wajib mengaktifkan Thick mode:
      this.oracledb.initOracleClient({ libDir: '/home/afifhnrstwn/oracle/instantclient_19_24' });

      const user = this.configService.get<string>('ORACLE_USER');
      const password = this.configService.get<string>('ORACLE_PASSWORD');
      const host = this.configService.get<string>('ORACLE_HOST') || 'localhost';
      const port = this.configService.get<string>('ORACLE_PORT') || '1521';
      const service = this.configService.get<string>('ORACLE_SERVICE') || 'ORCL';

      const connectString = `${host}:${port}/${service}`;

      if (user && password) {
        this.pool = await this.oracledb.createPool({
          user,
          password,
          connectString,
          poolMin: 2,
          poolMax: 10,
          poolIncrement: 2,
        });
        this.logger.log(`Oracle connection pool created to ${connectString}`);
      } else {
        this.logger.warn('ORACLE_USER or ORACLE_PASSWORD not defined. Skipping Oracle connection.');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Oracle connection pool', error);
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.close(10);
        this.logger.log('Oracle connection pool closed');
      } catch (error) {
        this.logger.error('Error closing Oracle connection pool', error);
      }
    }
  }

  /**
   * Get a connection from the pool.
   * Make sure to call connection.close() when done.
   */
  async getConnection() {
    if (!this.pool) {
      throw new Error('Oracle connection pool is not initialized');
    }
    return await this.pool.getConnection();
  }

  /**
   * Execute a query and automatically close the connection.
   */
  async query<T = any>(sql: string, params: any = {}): Promise<T[]> {
    const connection = await this.getConnection();
    try {
      const result = await connection.execute(sql, params, {
        outFormat: this.oracledb.OUT_FORMAT_OBJECT,
      });
      return (result.rows || []) as T[];
    } finally {
      await connection.close();
    }
  }

  /**
   * Execute INSERT/UPDATE/DELETE and automatically commit.
   */
  async execute(sql: string, params: any = {}): Promise<number> {
    const connection = await this.getConnection();
    try {
      const result = await connection.execute(sql, params, { autoCommit: true });
      return result.rowsAffected || 0;
    } finally {
      await connection.close();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 FROM DUAL');
      return result.length > 0;
    } catch (e) {
      this.logger.error('Oracle health check failed', e);
      return false;
    }
  }
}
