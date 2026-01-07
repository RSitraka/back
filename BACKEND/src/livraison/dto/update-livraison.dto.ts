import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { StatutLivraison } from '../livraison.entity';

export class UpdateLivraisonDto {
  @IsOptional()
  @IsEnum(StatutLivraison)
  statut?: StatutLivraison;

  @IsOptional()
  @IsDateString()
  dateArrivee?: string;
}
