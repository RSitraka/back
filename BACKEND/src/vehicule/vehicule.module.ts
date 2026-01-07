import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeService } from './vehicule.service';
import { vehiculeController } from './vehicule.controller';
import { Vehicule } from './vehicule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule])],
  controllers: [vehiculeController],
  providers: [VehiculeService],
  exports: [VehiculeService],
})
export class VehiculeModule {}
