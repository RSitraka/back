import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeModule } from './employe/employe.module';
import { MaterielModule } from './materiel/materiel.module';
import { SiteModule } from './site/site.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { DepenseModule } from './depense/depense.module';
import { PhotoModule } from './photo/photo.module';
import { FichierModule } from './fichier/fichier.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DemandeMaterielModule } from './demande-materiel/demande-materiel.module';
import { AuthModule } from './auth/auth.module';
import { DemandeAchatModule } from './demande-achat/demande-achat.module';
import { DemandeAvanceModule } from './demande-avance/demande-avance.module';
import { DemandeBudgetModule } from './demande-budget/demande-budget.module';
import { LivraisonModule } from './livraison/livraison.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    EmployeModule,
    MaterielModule,
    SiteModule,
    VehiculeModule,
    DepenseModule,
    PhotoModule,
    FichierModule,
    UserModule,
    DemandeMaterielModule,
    AuthModule,
    DemandeAchatModule,
    DemandeAvanceModule,
    DemandeBudgetModule,
    LivraisonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
