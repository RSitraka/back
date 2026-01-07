import {
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TypeDepense, PeriodeDepense } from '../depense.entity';

export class CreateDepenseDto {
  @IsEnum(TypeDepense)
  type: TypeDepense;

  @IsNumber()
  @Min(0)
  montant: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PeriodeDepense)
  @IsOptional()
  periode?: PeriodeDepense;

  @IsUUID()
  @IsOptional()
  siteId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string; // VALIDEUR

  @IsUUID()
  @IsOptional()
  demandeurId?: string; // DEMANDEUR (User)

  @IsUUID()
  @IsOptional()
  employeId?: string; // Employé (Table employe)

  @IsUUID()
  @IsOptional()
  materielId?: string;

  @IsUUID()
  @IsOptional()
  vehiculeId?: string;
}
