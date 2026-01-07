// src/photos/dto/create-photo.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty({ message: "L'URL est obligatoire" })
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4', { message: 'siteId doit être un UUID valide' })
  @IsNotEmpty({ message: 'siteId est obligatoire' })
  siteId: string;
}
