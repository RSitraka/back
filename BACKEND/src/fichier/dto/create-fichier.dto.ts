import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TypeFichier } from '../fichier.entity';
export class CreateFichierDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsEnum(TypeFichier, {
    message: 'Type invalide. Valeurs possibles : Scan de facture, Document, Autre',
  })
  @IsOptional()
  type?: TypeFichier;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsUUID('4', { message: 'siteId doit être un UUID valide' })
  @IsOptional()
  siteId?: string;
}

