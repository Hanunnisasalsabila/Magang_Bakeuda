import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateReferensiJpbDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'kode_jpb harus tepat 2 karakter' })
  kode_jpb: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nama_jpb: string;

  @IsOptional()
  @IsInt()
  urutan?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  keterangan?: string;
}
