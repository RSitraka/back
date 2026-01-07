// src/Vehicule/Vehicule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './vehicule.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private VehiculeRepository: Repository<Vehicule>,
  ) {}

  async create(createVehiculeDto: CreateVehiculeDto): Promise<Vehicule> {
    const Vehicule = this.VehiculeRepository.create(createVehiculeDto);
    return await this.VehiculeRepository.save(Vehicule);
  }

  async findAll(): Promise<Vehicule[]> {
    return await this.VehiculeRepository.find({
      relations: ['site', 'depenses'],
    });
  }

  async findOne(id: string): Promise<Vehicule> {
    const Vehicule = await this.VehiculeRepository.findOne({
      where: { id },
      relations: ['site', 'depenses'],
    });
    if (!Vehicule) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
    return Vehicule;
  }

  async findBySite(siteId: string): Promise<Vehicule[]> {
    return await this.VehiculeRepository.find({
      where: { site: { id: siteId } },
      relations: ['depenses'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.VehiculeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
  }
}
