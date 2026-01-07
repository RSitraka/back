// src/demande-achat/dto/update-demande-achat.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeAchatDto } from './create-demande-achat.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatutDemandeAchat } from '../demande-achat.entity';

export class UpdateDemandeAchatDto extends PartialType(CreateDemandeAchatDto) {
  @IsEnum(StatutDemandeAchat)
  @IsOptional()
  statut?: StatutDemandeAchat;
}
