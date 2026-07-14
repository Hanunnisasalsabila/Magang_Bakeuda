import { IsNotEmpty, IsString, MinLength, Matches, IsOptional, MaxLength } from 'class-validator';

export class CreatePetugasDto {
  @IsString()
  @MinLength(2, { message: 'Nama lengkap minimal 2 karakter' })
  nama_lengkap: string;

  @IsString()
  @MinLength(3, { message: 'Username minimal 3 karakter' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username hanya boleh huruf, angka, dan underscore',
  })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Kode wilayah wajib diisi' })
  kode_wilayah: string;

  @IsOptional()
  @IsString()
  @MaxLength(25, { message: 'NIP maksimal 25 karakter' })
  nip?: string;
}
