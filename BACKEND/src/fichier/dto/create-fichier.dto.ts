import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TypeFichier } from '../fichier.entity';

export class CreateFichierDto {
  @IsNotEmpty()
  url: string;

  @IsEnum(TypeFichier, {
    message:
      'Type invalide. Valeurs possibles : Scan de facture, Document, Autre',
  })
  @IsNotEmpty()
  type: TypeFichier;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4', { message: 'siteId doit être un UUID valide' })
  @IsNotEmpty()
  siteId: string;
}
