import { IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2, { message: 'Nama lengkap minimal 2 karakter' })
  nama_lengkap: string;

  @IsOptional()
  @IsString()
  @MaxLength(25, { message: 'NIP maksimal 25 karakter' })
  nip?: string;
}
