// src/demande-avance/dto/create-demande-avance.dto.ts
import {
  IsUUID,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateDemandeAvanceDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  montant: number;

  @IsString()
  @IsNotEmpty()
  motif: string;

  @IsUUID()
  @IsOptional()
  employeId?: string;

  @IsUUID()
  @IsOptional()
  siteId?: string; // Optionnel : si l'employé est lié à un site
}
