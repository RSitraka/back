// src/demande-achat/demande-achat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAchat } from './demande-achat.entity';
import { DemandeAchatService } from './demande-achat.service';
import { DemandeAchatController } from './demande-achat.controller';
import { Site } from '../site/site.entity'; // Pour SiteRepository
import { DepenseModule } from '../depense/depense.module'; // Pour DepenseService
import { DemandeBudgetModule } from '../demande-budget/demande-budget.module'; // Pour DemandeBudgetRepository
import { UserModule } from '../user/user.module';
import { MaterielModule } from '../materiel/materiel.module';
import { Materiel } from '../materiel/materiel.entity';

@Module({
  imports: [
    // Repositories disponibles dans ce module
    TypeOrmModule.forFeature([
      DemandeAchat,
      Site, // InjectRepository(Site) fonctionne
      Materiel,
    ]),

    // Modules externes
    DepenseModule, // Fournit DepenseService
    DemandeBudgetModule, //Fournit DemandeBudgetService
    UserModule,
    //MaterielModule,
  ],
  providers: [DemandeAchatService],
  controllers: [DemandeAchatController],
  exports: [DemandeAchatService],
})
export class DemandeAchatModule {}
