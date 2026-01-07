import { Controller, Post, Get, Patch, Body, Param, Req } from '@nestjs/common';
import { LivraisonService } from './livraison.service';
import { CreateLivraisonDto } from './dto/create-livraison.dto';
import { UpdateLivraisonDto } from './dto/update-livraison.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller('livraisons')
export class LivraisonController {
  constructor(private service: LivraisonService) {}

  @Post()
  @Roles(UserRole.LOGISTIC, UserRole.ADMIN)
  create(@Body() dto: CreateLivraisonDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLivraisonDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/valider')
  @Roles(UserRole.FINANCE, UserRole.ADMIN)
  valider(@Param('id') id: string, @Req() req: any) {
    const user = req.user; // récupère le valideur via JWT
    return this.service.valider(id, user);
  }
}
