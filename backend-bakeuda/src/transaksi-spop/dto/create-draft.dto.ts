import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsArray, IsOptional, IsBoolean, IsEnum, MaxLength, IsEmail } from 'class-validator';
import { JenisTransaksi, JenisTanah, StatusWp, Pekerjaan } from '@prisma/client';
import { BangunanLspopDto } from './bangunan-lspop.dto.js';

export class SubjekPajakDraftDto {
  @IsOptional() @IsString() @MaxLength(16) nik?: string;
  @IsOptional() @IsString() nama?: string;
  @IsOptional() @IsEnum(StatusWp) status_wp?: StatusWp;
  @IsOptional() @IsEnum(Pekerjaan) pekerjaan?: Pekerjaan;
  @IsOptional() @IsString() @MaxLength(20) npwp?: string;
  @IsOptional() @IsString() @MaxLength(15) no_hp?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() alamat?: string;
  @IsOptional() @IsString() blok_kav_no?: string;
  @IsOptional() @IsString() @MaxLength(5) rt?: string;
  @IsOptional() @IsString() @MaxLength(5) rw?: string;
  @IsOptional() @IsString() kelurahan?: string;
  @IsOptional() @IsString() kecamatan?: string;
  @IsOptional() @IsString() kabupaten?: string;
  @IsOptional() @IsString() @MaxLength(5) kode_pos?: string;
}

export class ObjekPajakDraftDto {
  @IsOptional() @IsEnum(JenisTanah) jenis_tanah?: JenisTanah;
  @IsOptional() @IsNumber() luas_tanah?: number;
  @IsOptional() @IsNumber() luas_bangunan?: number;
  @IsOptional() @IsNumber() jumlah_bangunan?: number;
  @IsOptional() @IsString() jalan_op?: string;
  @IsOptional() @IsString() no_persil?: string;
  @IsOptional() @IsString() blok_kav_no?: string;
  @IsOptional() @IsString() @MaxLength(5) rt_op?: string;
  @IsOptional() @IsString() @MaxLength(5) rw_op?: string;
  @IsOptional() @IsString() kelurahan_op?: string;
  @IsOptional() @IsString() kecamatan_op?: string;
  @IsOptional() @IsString() @MaxLength(50) latitude?: string;
  @IsOptional() @IsString() @MaxLength(50) longitude?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_utara?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_selatan?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_timur?: string;
  @IsOptional() @IsString() @MaxLength(50) batas_barat?: string;
}

export class LampiranDraftDto {
  @IsOptional() @IsString() jenis_dokumen?: string;
  @IsOptional() @IsString() url_file?: string;
}

export class CreateDraftDto {
  @IsOptional() @IsString() id_transaksi?: string; // Untuk update draft yang sudah ada
  @IsOptional() @IsBoolean() is_draft?: boolean;
  @IsOptional() @IsBoolean() is_kuasa?: boolean;

  @IsOptional() @IsEnum(JenisTransaksi) jenis_layanan?: JenisTransaksi;

  @IsOptional() @IsString() nop_utama?: string;
  @IsOptional() @IsArray() nop_asal?: string[];
  @IsOptional() @IsString() nop_bersama?: string;
  @IsOptional() @IsString() no_sppt_lama?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SubjekPajakDraftDto)
  subjek_pajak?: SubjekPajakDraftDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ObjekPajakDraftDto)
  objek_pajak_sementara?: ObjekPajakDraftDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LampiranDraftDto)
  lampiran?: LampiranDraftDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BangunanLspopDto)
  bangunan?: BangunanLspopDto[];
}
