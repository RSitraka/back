// src/demande-materiel/demande-materiel.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { DemandeMaterielService } from './demande-materiel.service';
import { CreateDemandeMaterielDto } from './dto/create-demande-materiel.dto';
import { UpdateDemandeMaterielDto } from './dto/update-demande-materiel.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
@Controller('demandes-materiel')
export class DemandeMaterielController {
  constructor(private readonly service: DemandeMaterielService) {}

  @Post()
  @Roles(UserRole.EMPLOYE)
  create(@Body() dto: CreateDemandeMaterielDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    return this.service.findAll(siteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDemandeMaterielDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/valider')
  @Roles(UserRole.LOGISTIC)
  valider(@Param('id') id: string) {
    return this.service.valider(id);
  }

  @Patch(':id/rejeter')
  @Roles(UserRole.LOGISTIC)
  rejeter(@Param('id') id: string) {
    return this.service.rejeter(id);
  }
}
