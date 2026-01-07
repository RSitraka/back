import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeBudget } from './demande-budget.entity';
import { Depense } from '../depense/depense.entity';
import { DemandeBudgetService } from './demande-budget.service';
import { DemandeBudgetController } from './demande-budget.controller';
import { UserModule } from '../user/user.module';
import { DepenseModule } from '../depense/depense.module';
import { SiteModule } from '../site/site.module';
import { VehiculeModule } from '../vehicule/vehicule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeBudget, Depense]),
    DepenseModule,
    UserModule,
    SiteModule,
    VehiculeModule,
  ],
  controllers: [DemandeBudgetController],
  providers: [DemandeBudgetService],
  exports: [DemandeBudgetService],
})
export class DemandeBudgetModule {}
