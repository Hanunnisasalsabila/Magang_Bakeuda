import { IsNumber, IsPositive, IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateObjekBumiDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  luas_bumi?: number;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  kode_znt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  jenis_bumi?: string;

  @IsNumber()
  @IsOptional()
  nilai_sistem_bumi?: number;
}
