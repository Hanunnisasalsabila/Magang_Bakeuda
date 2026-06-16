import {
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ValidateIf } from 'class-validator';

export class UpdatePetugasDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nama lengkap minimal 2 karakter' })
  nama_lengkap?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username minimal 3 karakter' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username hanya boleh huruf, angka, dan underscore',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Kode wilayah tidak boleh kosong' })
  kode_wilayah?: string;
}
