import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateVehiculeDto {
  @IsString()
  @IsNotEmpty()
  numeroMatricule: string;

  @IsNumber()
  @IsNotEmpty()
  montantDepenseCarburant: number;

  @IsString()
  @IsNotEmpty()
  nomMarque: string;

  @IsString()
  @IsOptional()
  nomAgence?: string;

  @IsString()
  @IsNotEmpty()
  numeroTelephoneConducteur: string;

  @IsUUID()
  @IsOptional()
  siteId?: string;
}
