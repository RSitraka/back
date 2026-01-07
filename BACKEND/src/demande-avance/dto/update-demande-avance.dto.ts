// src/demande-avance/dto/update-demande-avance.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeAvanceDto } from './create-demande-avance.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatutDemandeAvance } from '../demande-avance.entity';

export class UpdateDemandeAvanceDto extends PartialType(
  CreateDemandeAvanceDto,
) {
  @IsEnum(StatutDemandeAvance)
  @IsOptional()
  statut?: StatutDemandeAvance;
}
