import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichierService } from '../fichier/fichier.service';
import { FichierController } from './fichier.controller';
import { Fichier } from './fichier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fichier])],
  controllers: [FichierController],
  providers: [FichierService],
  exports: [FichierService],
})
export class FichierModule {}
