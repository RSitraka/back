// src/demande-avance/demande-avance.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { DemandeAvanceService } from './demande-avance.service';
import { CreateDemandeAvanceDto } from './dto/create-demande-avance.dto';
import { UpdateDemandeAvanceDto } from './dto/update-demande-avance.dto';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('demandes-avance')
export class DemandeAvanceController {
  constructor(private readonly service: DemandeAvanceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.EMPLOYE)
  create(@Body() dto: CreateDemandeAvanceDto, @Req() req) {
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
  update(@Param('id') id: string, @Body() dto: UpdateDemandeAvanceDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/valider')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.FINANCE)
  valider(@Param('id') id: string) {
    return this.service.valider(id);
  }

  @Patch(':id/rejeter')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.FINANCE)
  rejeter(@Param('id') id: string) {
    return this.service.rejeter(id);
  }
}
