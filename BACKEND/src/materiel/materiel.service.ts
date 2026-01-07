// src/materiel/materiel.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materiel } from './materiel.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { DepenseService } from '../depense/depense.service';
import { FichierService } from '../fichier/fichier.service';
import { TypeDepense } from '../depense/depense.entity';

@Injectable()
export class MaterielService {
  constructor(
    @InjectRepository(Materiel)
    private materielRepository: Repository<Materiel>,
    private depenseService: DepenseService,
    private fichierService: FichierService,
  ) {}

  async create(createMaterielDto: CreateMaterielDto): Promise<Materiel> {
    const { siteId, prix, nom, modele, nomFournisseur } = createMaterielDto;

    if (!siteId) {
      throw new BadRequestException('siteId is required');
    }

    const materiel = this.materielRepository.create(createMaterielDto);
    const savedMateriel = await this.materielRepository.save(materiel);

    // 1. Créer une dépense automatique
    await this.depenseService.create({
      montant: prix,
      description: `Achat matériel : ${nom} ${modele} (Fournisseur: ${nomFournisseur})`,
      type: TypeDepense.ACHAT_MATERIEL, // Changed to match the correct property name
      siteId,
      materielId: savedMateriel.id, // Lien avec le matériel
    });

    return savedMateriel;
  }

  async findAll(): Promise<Materiel[]> {
    return await this.materielRepository.find({
      relations: ['site'],
    });
  }

  async findOne(id: string): Promise<Materiel> {
    const materiel = await this.materielRepository.findOne({
      where: { id },
      relations: ['site'],
    });
    if (!materiel) {
      throw new NotFoundException(`Matériel avec l'ID ${id} non trouvé`);
    }
    return materiel;
  }

  async findBySite(siteId: string): Promise<Materiel[]> {
    return await this.materielRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }

  async update(
    id: string,
    updateMaterielDto: UpdateMaterielDto,
  ): Promise<Materiel> {
    const materiel = await this.findOne(id);
    Object.assign(materiel, updateMaterielDto);
    return await this.materielRepository.save(materiel);
  }

  async remove(id: string): Promise<void> {
    const result = await this.materielRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Matériel avec l'ID ${id} non trouvé`);
    }
  }

  // Nouvelle méthode : lier une facture (fichier) au matériel
  async assignFacture(materielId: string, fichierId: string): Promise<void> {
    const materiel = await this.findOne(materielId);
    const fichier = await this.fichierService.findOne(fichierId);

    if (fichier.site.id !== materiel.site?.id) {
      throw new BadRequestException(
        'Le fichier et le matériel doivent appartenir au même site',
      );
    }
  }
}
