import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username wajib diisi' })
  @MinLength(4, { message: 'Username minimal 4 karakter' })
  @Matches(/^\S+$/, { message: 'Username tidak boleh mengandung spasi' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
