// src/photos/dto/create-photo.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4', { message: 'siteId doit être un UUID valide' })
  @IsNotEmpty()
  siteId: string;
}
