import { IsEnum, IsString, IsOptional, ValidateIf, Length } from 'class-validator';
import { StatusAjuan } from '@prisma/client';

export class VerifikasiBakeudaDto {
  @IsEnum(StatusAjuan)
  status_ajuan: StatusAjuan;

  @ValidateIf(o => o.status_ajuan === StatusAjuan.REVISI || o.status_ajuan === StatusAjuan.DITOLAK)
  @IsString()
  catatan?: string;

  @IsString()
  @IsOptional()
  kode_wilayah?: string;

  @IsString()
  @IsOptional()
  @Length(3, 3, { message: 'Kode blok harus tepat 3 digit' })
  kode_blok?: string;

  @IsString()
  @IsOptional()
  @Length(1, 1, { message: 'Kode jenis OP harus tepat 1 digit' })
  kode_jenis_op?: string;
}
