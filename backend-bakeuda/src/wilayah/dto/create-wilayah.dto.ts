import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateWilayahDto {
  @IsString()
  @IsOptional()
  @Length(10, 10)
  kode_wilayah?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  kode_propinsi: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nama_propinsi?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  kode_dati2: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  kabupaten?: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_kecamatan: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  kecamatan: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_kelurahan: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nama_desa: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
