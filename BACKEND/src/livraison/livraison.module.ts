// src/livraison/livraison.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Livraison } from './livraison.entity';
import { LivraisonService } from './livraison.service';
import { LivraisonController } from './livraison.controller';

import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Vehicule } from '../vehicule/vehicule.entity';
import { Site } from '../site/site.entity';
import { User } from '../user/user.entity';
import { Depense } from '../depense/depense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Livraison,
      DemandeAchat,
      Vehicule,
      Site,
      User,
      Depense,
    ]),
  ],
  controllers: [LivraisonController],
  providers: [LivraisonService],
  exports: [LivraisonService],
})
export class LivraisonModule {}
