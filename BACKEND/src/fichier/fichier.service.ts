// src/fichier/fichier.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fichier } from './fichier.entity';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { UpdateFichierDto } from './dto/update-fichier.dto';
import { ft_delete } from '../utils/utils';

@Injectable()
export class FichierService {
  constructor(
    @InjectRepository(Fichier)
    private fichierRepository: Repository<Fichier>,
  ) {}

  async create(createFichierDto: CreateFichierDto): Promise<Fichier> {
    const fichier = this.fichierRepository.create({
      ...createFichierDto,
      site: createFichierDto.siteId ? { id: createFichierDto.siteId } : undefined
    });
    return await this.fichierRepository.save(fichier);
  }

  async findAll(): Promise<Fichier[]> {
    return await this.fichierRepository.find({
      relations: ['site'],
    });
  }

  async findOne(id: string): Promise<Fichier> {
    const fichier = await this.fichierRepository.findOne({
      where: { id },
      relations: ['site'],
    });
    if (!fichier) {
      throw new NotFoundException(`Fichier avec l'ID ${id} non trouvé`);
    }
    return fichier;
  }

  async findBySite(siteId: string): Promise<Fichier[]> {
    return await this.fichierRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }

  async update(
    id: string,
    updateFichierDto: UpdateFichierDto,
  ): Promise<Fichier> {
    const fichier = await this.findOne(id);
    Object.assign(fichier, updateFichierDto);
    return await this.fichierRepository.save(fichier);
  }

  async remove(id: string): Promise<void> {
    const fichier = await this.fichierRepository.findOne({
      where: { id },
    });
    if (!fichier) {
      throw new NotFoundException('Fichier introuvable');
    }
    const fichierUrl = fichier.url;
    ft_delete(fichierUrl);
    await this.fichierRepository.delete(id);
  }
}
