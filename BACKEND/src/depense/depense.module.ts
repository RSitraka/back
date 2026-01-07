// src/depense/depense.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepenseService } from './depense.service';
import { DepenseController } from './depense.controller';

import { Depense } from './depense.entity';
import { Site } from '../site/site.entity';
import { User } from '../user/user.entity'; // AJOUTÉ
import { Employe } from '../employe/employe.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Vehicule } from '../vehicule/vehicule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Depense,
      Site,
      User,
      Employe,
      Materiel,
      Vehicule,
    ]),
  ],
  controllers: [DepenseController],
  providers: [DepenseService],
  exports: [DepenseService],
})
export class DepenseModule {}
