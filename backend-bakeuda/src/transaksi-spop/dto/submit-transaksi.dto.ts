import { IsString, IsNumber, ValidateNested, IsArray, IsOptional, IsBoolean, IsEnum, Length, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { JenisTransaksi, JenisTanah, StatusWp, Pekerjaan } from '@prisma/client';

export class CalonSubjekDto {
  @IsString() nik: string;
  @IsString() nama_subjek: string;
  @IsEnum(StatusWp) status_wp: StatusWp;
  @IsEnum(Pekerjaan) pekerjaan: Pekerjaan;
  @IsOptional() @IsString() npwp?: string;
  @IsOptional() @IsString() no_hp?: string;
  @IsOptional() @IsString() email?: string;
  @IsString() alamat_jalan: string;
  @IsOptional() @IsString() blok_kav_no_subjek?: string;
  @IsOptional() @IsString() rt?: string;
  @IsOptional() @IsString() rw?: string;
  @IsOptional() @IsString() kelurahan?: string;
  @IsOptional() @IsString() kecamatan?: string;
  @IsOptional() @IsString() kabupaten?: string;
  @IsOptional() @IsString() kode_wilayah?: string;
  @IsOptional() @IsString() kode_pos?: string;
}

export class DetailAsalInputDto {
  @IsString() @Length(18, 18) nop_asal: string;
  @IsOptional() @IsBoolean() nonaktifkan_saat_disetujui?: boolean;
}

export class DetailTujuanInputDto {
  @IsOptional() @IsString() nik_calon_subjek?: string;
  
  @IsOptional() 
  @ValidateNested() 
  @Type(() => CalonSubjekDto) 
  calon_subjek_json?: CalonSubjekDto;

  @IsNumber() luas_tanah_baru: number;
  @IsOptional() @IsNumber() luas_bangunan_baru?: number;
  @IsEnum(JenisTanah) jenis_tanah_baru: JenisTanah;
  
  @IsOptional() @IsString() jalan_op_baru?: string;
  @IsOptional() @IsString() kode_wilayah_baru?: string;
  @IsOptional() @IsString() kode_blok_baru?: string;
  @IsOptional() @IsString() no_persil_baru?: string;
  @IsOptional() @IsString() rt_op_baru?: string;
  @IsOptional() @IsString() rw_op_baru?: string;
  @IsOptional() @IsString() blok_kav_no_baru?: string;
  @IsOptional() @IsString() kelurahan_op_baru?: string;
  @IsOptional() @IsString() kecamatan_op_baru?: string;
  @IsOptional() @IsString() latitude?: string;
  @IsOptional() @IsString() longitude?: string;
  @IsOptional() @IsString() batas_utara?: string;
  @IsOptional() @IsString() batas_selatan?: string;
  @IsOptional() @IsString() batas_timur?: string;
  @IsOptional() @IsString() batas_barat?: string;

  @IsOptional() @IsArray() data_bangunan_json?: any[];
}

export class SubmitTransaksiDto {
  @IsEnum(JenisTransaksi) jenis_transaksi: JenisTransaksi;
  @IsOptional() @IsString() no_formulir?: string;
  @IsNumber() tahun_pajak: number;
  @IsOptional() @IsString() no_sppt_lama?: string;
  @IsOptional() @IsString() nama_pengaju?: string;
  @IsOptional() @IsBoolean() menggunakan_kuasa?: boolean;
  @IsDateString() tanggal_pengajuan: string;
  @IsOptional() @IsString() nop_bersama?: string;

  @IsOptional() 
  @IsArray() 
  @ValidateNested({ each: true }) 
  @Type(() => DetailAsalInputDto)
  detail_asal?: DetailAsalInputDto[];

  @IsOptional() 
  @IsArray() 
  @ValidateNested({ each: true }) 
  @Type(() => DetailTujuanInputDto)
  detail_tujuan?: DetailTujuanInputDto[];

  @IsOptional() 
  @IsArray() 
  lampiran?: { jenis_dokumen: string; url_file: string }[];
}
