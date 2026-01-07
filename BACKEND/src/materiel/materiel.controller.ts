// src/materiel/materiel.controller.ts
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
import { MaterielService } from './materiel.service';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';

@Controller('materiels') // <-- MINUSCULES (corrigé)
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}

  @Post()
  create(@Body() createMaterielDto: CreateMaterielDto) {
    return this.materielService.create(createMaterielDto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.materielService.findBySite(siteId);
    }
    return this.materielService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materielService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterielDto: UpdateMaterielDto,
  ) {
    return this.materielService.update(id, updateMaterielDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materielService.remove(id);
  }
}
