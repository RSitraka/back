// src/modules/employe/dto/update-employe.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterielDto } from './create-materiel.dto';

export class UpdateMaterielDto extends PartialType(CreateMaterielDto) {}
