// src/employe/dto/update-employe.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEmployeDto } from './create-employe.dto';

export class UpdateEmployeDto extends PartialType(
  OmitType(CreateEmployeDto, ['siteId'] as const),
) {}
