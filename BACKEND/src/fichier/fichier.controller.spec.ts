// src/fichier/fichier.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FichierService } from './fichier.service';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { UpdateFichierDto } from './dto/update-fichier.dto';

@Controller('fichiers')
export class FichierController {
  constructor(private readonly fichierService: FichierService) {}

  @Post()
  create(@Body() createFichierDto: CreateFichierDto) {
    return this.fichierService.create(createFichierDto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.fichierService.findBySite(siteId);
    }
    return this.fichierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichierService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFichierDto: UpdateFichierDto) {
    return this.fichierService.update(id, updateFichierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichierService.remove(id);
  }
}
