import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  Length,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JenisTanah } from '@prisma/client';

export class BumiDto {
  @IsNumber()
  @IsPositive()
  luas_bumi: number;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  kode_znt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  jenis_bumi?: string;

  @IsNumber()
  @IsOptional()
  nilai_sistem_bumi?: number;
}

export class BangunanDto {
  @IsNumber()
  @IsPositive()
  luas_bangunan: number;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  kode_jpb?: string;

  @IsNumber()
  @IsOptional()
  tahun_dibangun?: number;

  @IsNumber()
  @IsOptional()
  jumlah_lantai?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  kondisi_bangunan?: string;
}

export class CreateObjekPajakDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  kode_propinsi: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  kode_dati2: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_kecamatan: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_kelurahan: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_blok: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1)
  kode_jenis_op: string;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  nik_subjek: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  no_persil?: string;

  @IsString()
  @IsNotEmpty()
  jalan_op: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  blok_kav_no?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rw_op?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rt_op?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  kelurahan_op: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  kecamatan_op: string;

  @IsEnum(JenisTanah)
  jenis_tanah: JenisTanah;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Minimal 1 data bumi diperlukan' })
  @Type(() => BumiDto)
  bumi: BumiDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BangunanDto)
  bangunan?: BangunanDto[];
}
