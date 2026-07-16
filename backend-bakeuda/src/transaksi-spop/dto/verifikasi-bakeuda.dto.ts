import { IsEnum, IsString, IsOptional, ValidateIf } from 'class-validator';
import { StatusAjuan } from '@prisma/client';

export class VerifikasiBakeudaDto {
  @IsEnum(StatusAjuan)
  status_ajuan: StatusAjuan;

  @ValidateIf(o => o.status_ajuan === StatusAjuan.REVISI || o.status_ajuan === StatusAjuan.DITOLAK)
  @IsString()
  catatan?: string;

  @IsString()
  @IsOptional()
  nop_baru?: string;
}
