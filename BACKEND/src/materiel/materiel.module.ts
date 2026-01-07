import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterielService } from './materiel.service';
import { MaterielController } from './materiel.controller';
import { Materiel } from './materiel.entity';

//import pour la generation automatique de depense
import { DepenseModule } from '../depense/depense.module';
import { FichierModule } from '../fichier/fichier.module';

@Module({
  imports: [TypeOrmModule.forFeature([Materiel]), DepenseModule, FichierModule],
  controllers: [MaterielController],
  providers: [MaterielService],
  exports: [MaterielService],
})
export class MaterielModule {}
