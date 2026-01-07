// src/demande-materiel/demande-materiel.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeMateriel } from './demande-materiel.entity';
import { DemandeMaterielService } from './demande-materiel.service';
import { DemandeMaterielController } from './demande-materiel.controller';
import { Materiel } from '../materiel/materiel.entity';
import { Site } from '../site/site.entity';
import { DepenseModule } from '../depense/depense.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeMateriel, Materiel, Site]),
    DepenseModule,
  ],
  providers: [DemandeMaterielService],
  controllers: [DemandeMaterielController],
  exports: [DemandeMaterielService],
})
export class DemandeMaterielModule {}
