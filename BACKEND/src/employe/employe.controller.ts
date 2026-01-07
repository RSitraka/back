// src/employe/employe.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { EmployeService } from './employe.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employes')
export class EmployeController {
  constructor(private readonly employeService: EmployeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.EMPLOYE, UserRole.ADMIN)
  create(@Body() dto: CreateEmployeDto) {
    return this.employeService.create(dto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) return this.employeService.findBySite(siteId);
    return this.employeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeDto) {
    return this.employeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeService.remove(id);
  }
}
