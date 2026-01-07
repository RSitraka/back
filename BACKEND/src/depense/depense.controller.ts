// src/depense/depense.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DepenseService } from './depense.service';
import { CreateDepenseDto } from './dto/create-depense.dto';
//import { UpdateDepenseDto } from './dto/update-depense.dto';

@Controller('depenses')
export class DepenseController {
  constructor(private readonly depenseService: DepenseService) {}

  @Post()
  create(@Body() createDepenseDto: CreateDepenseDto) {
    return this.depenseService.create(createDepenseDto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.depenseService.findBySite(siteId);
    }
    return this.depenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depenseService.findOne(id);
  }

  @Get(':id/materiel')
  getMateriel(@Param('id') id: string) {
    return this.depenseService.getMateriel(id);
  }

  /*@Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepenseDto: UpdateDepenseDto,
  ) {
    return this.depenseService.update(id, updateDepenseDto);
  }*/

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depenseService.remove(id);
  }
}
