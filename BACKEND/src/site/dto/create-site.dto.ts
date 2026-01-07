import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { TypeTravail, StatutSite } from '../site.entity';

export class CreateSiteDto {
  @IsEnum(TypeTravail)
  @IsNotEmpty()
  typeTravail: TypeTravail;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsString()
  @IsNotEmpty()
  coordonneesGPS: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(StatutSite)
  @IsOptional()
  statut?: StatutSite;
}
