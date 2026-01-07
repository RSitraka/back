import { IsString, IsNumber, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateDemandeBudgetDto {
  @IsString()
  @IsNotEmpty()
  motif: string;

  @IsNumber()
  montant: number;

  @IsUUID()
  siteId: string;

  @IsUUID()
  demandeurId: string;
}
