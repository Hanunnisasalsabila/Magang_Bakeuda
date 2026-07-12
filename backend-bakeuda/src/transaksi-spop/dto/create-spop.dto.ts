import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsArray, IsOptional } from 'class-validator';

export class SubjekPajakTempDto {
  @IsString() nik: string;
  @IsString() nama: string;
  @IsString() pekerjaan: string;
  @IsString() alamat: string;
}

export class ObjekPajakTempDto {
  @IsString() jalan_op: string;
  @IsString() rt_op: string;
  @IsString() rw_op: string;
  @IsNumber() luas_tanah: number;
  @IsString() jenis_tanah: string;
}

export class LampiranDto {
  @IsString() jenis_dokumen: string;
  @IsString() url_file: string;
}

export class CreateSpopDto {
  @IsString() 
  jenis_layanan: string;

  @ValidateNested()
  @Type(() => SubjekPajakTempDto)
  subjek_pajak: SubjekPajakTempDto;

  @ValidateNested()
  @Type(() => ObjekPajakTempDto)
  objek_pajak_sementara: ObjekPajakTempDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LampiranDto)
  lampiran?: LampiranDto[];
}
