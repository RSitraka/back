import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { StatutLivraison } from '../livraison.entity';

export class CreateLivraisonDto {
  @IsUUID()
  demandeAchatId: string;

  @IsUUID()
  vehiculeId: string;

  @IsUUID()
  siteId: string;

  @IsEnum(StatutLivraison)
  @IsOptional()
  statut?: StatutLivraison;

  @IsDateString()
  @IsOptional()
  dateDepart?: string;
}
