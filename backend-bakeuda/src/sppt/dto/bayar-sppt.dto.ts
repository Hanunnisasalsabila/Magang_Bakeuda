import { IsOptional, IsDateString } from 'class-validator';

export class BayarSpptDto {
  @IsDateString()
  @IsOptional()
  tgl_bayar?: string; // ISO date string, opsional (default = now)
}
