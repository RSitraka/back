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
import { FichierService } from '../fichier/fichier.service'; // Adjusted import path
import { CreateFichierDto } from './dto/create-fichier.dto';
import { UpdateFichierDto } from './dto/update-fichier.dto';

@Controller('fichiers')
export class FichierController {
  constructor(private readonly FichierService: FichierService) {}

  @Post()
  create(@Body() createfichierDto: CreateFichierDto) {
    return this.FichierService.create(createfichierDto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.FichierService.findBySite(siteId);
    }
    return this.FichierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.FichierService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatefichierDto: UpdateFichierDto) {
    return this.FichierService.update(id, updatefichierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.FichierService.remove(id);
  }
}
