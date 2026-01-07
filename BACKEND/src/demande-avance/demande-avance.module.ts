// src/demande-avance/demande-avance.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAvance } from './demande-avance.entity';
import { DemandeAvanceService } from './demande-avance.service';
import { DemandeAvanceController } from './demande-avance.controller';
import { Site } from '../site/site.entity';
import { DepenseModule } from '../depense/depense.module';
import { Employe } from '../employe/employe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeAvance, Site, Employe]),
    DepenseModule, // Pour DepenseService
  ],
  providers: [DemandeAvanceService],
  controllers: [DemandeAvanceController],
  exports: [DemandeAvanceService],
})
export class DemandeAvanceModule {}
