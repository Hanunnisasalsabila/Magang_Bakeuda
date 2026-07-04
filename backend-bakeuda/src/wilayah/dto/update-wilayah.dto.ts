import { PartialType } from '@nestjs/mapped-types';
import { CreateWilayahDto } from './create-wilayah.dto.js';

export class UpdateWilayahDto extends PartialType(CreateWilayahDto) {}
