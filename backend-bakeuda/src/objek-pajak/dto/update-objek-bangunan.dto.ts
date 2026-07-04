import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateObjekBangunanDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  luas_bangunan?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  kondisi_bangunan?: string;

  @IsNumber()
  @IsOptional()
  jumlah_lantai?: number;

  @IsNumber()
  @IsOptional()
  tahun_renovasi?: number;
}
