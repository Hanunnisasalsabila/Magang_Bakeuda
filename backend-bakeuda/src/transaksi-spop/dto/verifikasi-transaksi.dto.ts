import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum StatusAjuan {
  DRAFT = 'DRAFT',
  MENUNGGU = 'MENUNGGU',
  DISETUJUI = 'DISETUJUI',
  DITOLAK = 'DITOLAK',
  REVISI = 'REVISI',
}

export class VerifikasiTransaksiDto {
  @IsEnum(StatusAjuan)
  status_ajuan: StatusAjuan;

  @IsString()
  @IsOptional()
  catatan_bakeuda?: string;
}
