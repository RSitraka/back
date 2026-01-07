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
import { VehiculeService } from '../vehicule/vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller('vehicules')
export class vehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post()
  @Roles(UserRole.LOGISTIC, UserRole.ADMIN)
  create(@Body() createvehiculeDto: CreateVehiculeDto) {
    return this.vehiculeService.create(createvehiculeDto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.vehiculeService.findBySite(siteId);
    }
    return this.vehiculeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiculeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiculeService.remove(id);
  }
}
