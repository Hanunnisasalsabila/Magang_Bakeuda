import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjekPajakDto } from './create-subjek-pajak.dto.js';

export class UpdateSubjekPajakDto extends PartialType(CreateSubjekPajakDto) {}
