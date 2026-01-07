import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DemandeBudgetService } from './demande-budget.service';
import { CreateDemandeBudgetDto } from './dto/create-demande-budget.dto';
import { UpdateDemandeBudgetDto } from './dto/update-demande-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller('demande-budget')
export class DemandeBudgetController {
  constructor(private readonly demandeBudgetService: DemandeBudgetService) {}

  @Post()
  @Roles(UserRole.LOGISTIC, UserRole.ADMIN)
  create(@Body() dto: CreateDemandeBudgetDto) {
    return this.demandeBudgetService.create(dto);
  }

  @Get()
  findAll() {
    return this.demandeBudgetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandeBudgetService.findOne(id);
  }

  @Patch(':id/valider')
  @Roles(UserRole.FINANCE, UserRole.ADMIN)
  async valider(
    @Param('id') id: string,
    @Body() dto: UpdateDemandeBudgetDto,
    @Request() req,
  ) {
    console.log('DTO reçu:', dto);
    console.log('Statut reçu:', dto.statut);
    console.log('Type de statut:', typeof dto.statut);
    const valideurId = req.user.id;
    return this.demandeBudgetService.valider(id, dto, valideurId);
  }
}
