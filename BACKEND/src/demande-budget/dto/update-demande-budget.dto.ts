import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StatutDemande } from '../demande-budget.entity';

export class UpdateDemandeBudgetDto {
  @IsEnum(StatutDemande)
  @IsNotEmpty()
  statut: StatutDemande;
}
