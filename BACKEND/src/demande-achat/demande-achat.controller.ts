// src/demande-achat/demande-achat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DemandeAchatService } from './demande-achat.service';
import { CreateDemandeAchatDto } from './dto/create-demande-achat.dto';
import { UpdateDemandeAchatDto } from './dto/update-demande-achat.dto';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('demandes-achat')
export class DemandeAchatController {
  constructor(private readonly service: DemandeAchatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.EMPLOYE, UserRole.LOGISTIC, UserRole.ADMIN)
  create(@Body() dto: CreateDemandeAchatDto, @Req() req) {
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
  update(@Param('id') id: string, @Body() dto: UpdateDemandeAchatDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/valider')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.FINANCE, UserRole.LOGISTIC, UserRole.ADMIN)
  valider(@Param('id') id: string, @Req() req) {
    return this.service.valider(id, req.user);
  }

  @Patch(':id/rejeter')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.FINANCE, UserRole.LOGISTIC) // à revoir pour savoir qui peut rejeter la demande achat??
  rejeter(@Param('id') id: string) {
    return this.service.rejeter(id);
  }
}
