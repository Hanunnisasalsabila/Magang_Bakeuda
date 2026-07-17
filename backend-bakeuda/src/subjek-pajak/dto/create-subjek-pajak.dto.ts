import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  Length,
  MaxLength,
} from 'class-validator';
import { StatusWp, Pekerjaan } from '@prisma/client';

export class CreateSubjekPajakDto {
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'NIK harus 16 digit' })
  nik: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nama_subjek: string;

  @IsEnum(StatusWp)
  status_wp: StatusWp;

  @IsEnum(Pekerjaan)
  pekerjaan: Pekerjaan;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  npwp?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  npwpd?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  no_hp?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  alamat_jalan: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  blok_kav_no_subjek?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rw?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rt?: string;

  @IsString()
  @IsOptional()
  @Length(10, 10)
  kode_wilayah?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  kode_pos?: string;
}
