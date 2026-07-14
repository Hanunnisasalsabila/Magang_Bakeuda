import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReferensiJpbDto } from './create-referensi-jpb.dto.js';

export class UpdateReferensiJpbDto extends PartialType(CreateReferensiJpbDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean; // untuk re-aktifkan kode yang sudah dinonaktifkan
}
