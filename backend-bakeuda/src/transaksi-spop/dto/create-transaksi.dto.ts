import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum JenisTransaksi {
  BARU = 'BARU',
  MUTASI = 'MUTASI',
  PECAH = 'PECAH',
  GABUNG = 'GABUNG',
  PERUBAHAN_DATA = 'PERUBAHAN_DATA',
}

export class DetailAsalDto {
  @IsString()
  @IsOptional()
  nop_asal?: string;
}

export class DetailTujuanDto {
  @IsString()
  nik_calon_subjek: string;

  @IsNumber()
  luas_tanah_baru: number;

  @IsNumber()
  @IsOptional()
  luas_bangunan_baru?: number;

  @IsNumber()
  @IsOptional()
  jumlah_bangunan_baru?: number;

  @IsString()
  jenis_tanah_baru: string;

  @IsString()
  @IsOptional()
  no_persil_baru?: string;

  @IsString()
  @IsOptional()
  nop_generated?: string;
}

export class CreateTransaksiDto {
  @IsEnum(JenisTransaksi)
  jenis_transaksi: JenisTransaksi;

  @IsNumber()
  tahun_pajak: number;

  @IsString()
  @IsOptional()
  nop_bersama?: string;

  @IsString()
  @IsOptional()
  no_sppt_lama?: string;

  @IsString()
  @IsOptional()
  nama_pengaju?: string;

  @IsBoolean()
  @IsOptional()
  menggunakan_kuasa?: boolean;

  @ValidateNested({ each: true })
  @Type(() => DetailAsalDto)
  @IsOptional()
  detail_asal?: DetailAsalDto[];

  @ValidateNested({ each: true })
  @Type(() => DetailTujuanDto)
  detail_tujuan: DetailTujuanDto[];
}
