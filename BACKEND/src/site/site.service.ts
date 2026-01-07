import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    const site = this.siteRepository.create(createSiteDto);
    return await this.siteRepository.save(site);
  }

  async findAll(): Promise<Site[]> {
    return await this.siteRepository.find({
      relations: ['employes', 'materiels', 'vehicules', 'depenses'],
    });
  }

  async findOne(id: string): Promise<Site> {
    const site = await this.siteRepository.findOne({
      where: { id },
      relations: [
        'employes',
        'materiels',
        'vehicules',
        'depenses',
        'photos',
        'fichiers',
      ],
    });
    if (!site) {
      throw new NotFoundException(`Site avec l'ID ${id} non trouvé`);
    }
    return site;
  }

  async getTotalDepenses(id: string): Promise<{ total: number; parType: any }> {
    const site = await this.findOne(id);

    const total = site.depenses.reduce(
      (sum, depense) => sum + Number(depense.montant),
      0,
    );

    const parType = site.depenses.reduce((acc, depense) => {
      if (!acc[depense.type]) {
        acc[depense.type] = 0;
      }
      acc[depense.type] += Number(depense.montant);
      return acc;
    }, {});

    return { total, parType };
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const site = await this.findOne(id);
    Object.assign(site, updateSiteDto);
    return await this.siteRepository.save(site);
  }

  async remove(id: string): Promise<void> {
    const result = await this.siteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Site avec l'ID ${id} non trouvé`);
    }
  }
}
