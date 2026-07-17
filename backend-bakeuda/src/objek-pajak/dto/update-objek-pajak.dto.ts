import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { JenisTanah } from '@prisma/client';

export class UpdateObjekPajakDto {
  @IsString()
  @IsOptional()
  no_persil?: string;

  @IsString()
  @IsOptional()
  jalan_op?: string;

  @IsString()
  @IsOptional()
  blok_kav_no?: string;

  @IsString()
  @IsOptional()
  rw_op?: string;

  @IsString()
  @IsOptional()
  rt_op?: string;



  @IsEnum(JenisTanah)
  @IsOptional()
  jenis_tanah?: JenisTanah;

  @IsNumber()
  @IsOptional()
  njop_tanah?: number;

  @IsNumber()
  @IsOptional()
  njop_bangunan?: number;

  @IsNumber()
  @IsOptional()
  tahun_penilaian?: number;
}
