import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeMaterielDto } from './create-demande-materiel.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateDemandeMaterielDto extends PartialType(
  CreateDemandeMaterielDto,
) {
  @IsEnum(['EN_ATTENTE', 'VALIDEE', 'REJETEE'])
  @IsOptional()
  statut?: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
}
