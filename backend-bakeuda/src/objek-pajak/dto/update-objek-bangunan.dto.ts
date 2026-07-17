import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { KondisiBangunan } from '@prisma/client';

export class UpdateObjekBangunanDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  luas_bangunan?: number;

  @IsEnum(KondisiBangunan)
  @IsOptional()
  kondisi_bangunan?: KondisiBangunan;

  @IsNumber()
  @IsOptional()
  jumlah_lantai?: number;

  @IsNumber()
  @IsOptional()
  tahun_renovasi?: number;
}
