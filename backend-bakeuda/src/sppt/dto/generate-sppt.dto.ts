import { IsNumber, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class GenerateSpptDto {
  @IsString()
  @IsOptional()
  @Length(18, 18, { message: 'NOP harus 18 digit (kosongkan untuk massal)' })
  nop?: string; // jika kosong = generate massal

  @IsInt()
  @IsNumber()
  @Min(2000)
  tahun_pajak: number;
}
