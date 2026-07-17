import { IsNumber, Min } from 'class-validator';

export class UpdateReferensiDbkbDto {
  @IsNumber()
  @Min(0)
  nilai_per_m2: number;
}
