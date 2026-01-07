// src/demande-achat/dto/create-demande-achat.dto.ts
import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { TypeDepense } from '../../depense/depense.entity';

export class CreateDemandeAchatDto {
  @IsString()
  @IsNotEmpty()
  nom: string;
  /*
  @IsString()
  motif: string; //*/

  @IsEnum(TypeDepense)
  @IsOptional()
  type?: TypeDepense;

  @IsString()
  @IsNotEmpty()
  modele: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  prixEstime: number;

  @IsString()
  @IsNotEmpty()
  fournisseur: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  siteId: string;
}
