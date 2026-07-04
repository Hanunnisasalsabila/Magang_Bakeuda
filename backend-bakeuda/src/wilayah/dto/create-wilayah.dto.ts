import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWilayahDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  kode_wilayah: string;

  @IsString()
  @IsNotEmpty()
  nama_desa: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  kode_kel: string;

  @IsString()
  @IsNotEmpty()
  kecamatan: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  kode_kec: string;

  @IsString()
  @IsNotEmpty()
  kabupaten: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  kode_kab: string;
}
