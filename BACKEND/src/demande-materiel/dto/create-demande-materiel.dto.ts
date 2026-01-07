import {
  IsUUID,
  IsInt,
  Min,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateDemandeMaterielDto {
  @IsUUID()
  materielId: string;

  @IsInt()
  @Min(1)
  quantite: number;

  @IsString()
  motif: string;

  @IsString()
  @IsOptional()
  justificatifUrl?: string;

  @IsUUID()
  siteId: string;
}
