// src/employe/dto/create-employe.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateEmployeDto {
  // --- Informations User ---
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  // --- Informations Employe ---
  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsString()
  @IsNotEmpty()
  numeroTelephone: string;

  @IsString()
  @IsOptional()
  nationalite?: string;

  @IsString()
  @IsOptional()
  scanPhotoCIN?: string;

  @IsString()
  @IsOptional()
  scanCertificat?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salaire?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  avanceCumulee?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  resteSalaire?: number;

  // --- Relation ---
  @IsUUID()
  @IsOptional()
  siteId?: string;
}
