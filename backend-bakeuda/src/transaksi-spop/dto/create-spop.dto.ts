import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsArray, IsOptional, IsBoolean, IsEnum, MaxLength, IsEmail, IsNotEmpty } from 'class-validator';
import { JenisTransaksi, JenisTanah, StatusWp, Pekerjaan } from '@prisma/client';
import { BangunanLspopDto } from './bangunan-lspop.dto.js';

export class SubjekPajakTempDto {
  @IsString() 
  @MaxLength(16)
  nik: string;

  @IsString() nama: string;

  @IsEnum(StatusWp)
  status_wp: StatusWp;

  @IsEnum(Pekerjaan)
  pekerjaan: Pekerjaan;

  @IsOptional() @IsString() @MaxLength(20) npwp?: string;
  @IsOptional() @IsString() @MaxLength(15) no_hp?: string;
  @IsOptional() @IsEmail() email?: string;

  @IsString() alamat: string;
  
  @IsOptional() @IsString() blok_kav_no?: string;

  @IsNotEmpty() @IsString() @MaxLength(5) rt: string;
  @IsNotEmpty() @IsString() @MaxLength(5) rw: string;

  @IsString() kelurahan: string;
  @IsOptional() @IsString() kecamatan?: string;
  @IsString() kabupaten: string;

  @IsOptional() @IsString() @MaxLength(5) kode_pos?: string;
}

export class ObjekPajakTempDto {
  @IsEnum(JenisTanah)
  jenis_tanah: JenisTanah;

  @IsNumber() luas_tanah: number;

  @IsOptional() @IsNumber() luas_bangunan?: number;
  @IsOptional() @IsNumber() jumlah_bangunan?: number;

  @IsString() jalan_op: string;
  @IsOptional() @IsString() no_persil?: string;
  @IsOptional() @IsString() blok_kav_no?: string;

  @IsOptional() @IsString() @MaxLength(5) rt_op?: string;
  @IsOptional() @IsString() @MaxLength(5) rw_op?: string;

  @IsString() kelurahan_op: string;
  @IsString() kecamatan_op: string;

  @IsOptional() @IsString() @MaxLength(50) latitude?: string;
  @IsOptional() @IsString() @MaxLength(50) longitude?: string;
  @IsOptional() koordinat_polygon?: any;
  @IsOptional() @IsString() @MaxLength(50) batas_utara?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_selatan?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_timur?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_barat?: string;
}

export class LampiranDto {
  @IsString() jenis_dokumen: string;
  @IsString() url_file: string;
}

export class CreateSpopDto {
  @IsOptional() @IsString() id_transaksi?: string;
  @IsOptional() @IsBoolean() is_draft?: boolean;
  @IsOptional() @IsBoolean() is_kuasa?: boolean;

  @IsEnum(JenisTransaksi)
  jenis_layanan: JenisTransaksi;

  @IsOptional() @IsString() nop_utama?: string;
  @IsOptional() @IsArray() nop_asal?: string[];
  @IsOptional() @IsString() nop_bersama?: string;
  @IsOptional() @IsString() no_sppt_lama?: string;

  @ValidateNested()
  @Type(() => SubjekPajakTempDto)
  subjek_pajak: SubjekPajakTempDto;

  @ValidateNested()
  @Type(() => ObjekPajakTempDto)
  objek_pajak_sementara: ObjekPajakTempDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LampiranDto)
  lampiran?: LampiranDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BangunanLspopDto)
  bangunan?: BangunanLspopDto[];
}
