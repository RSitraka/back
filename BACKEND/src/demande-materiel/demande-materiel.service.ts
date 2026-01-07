// src/demande-materiel/demande-materiel.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandeMateriel, StatutDemande } from './demande-materiel.entity';
import { CreateDemandeMaterielDto } from './dto/create-demande-materiel.dto';
import { UpdateDemandeMaterielDto } from './dto/update-demande-materiel.dto';
import { User } from '../user/user.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Site } from '../site/site.entity';
import { DepenseService } from '../depense/depense.service';

@Injectable()
export class DemandeMaterielService {
  constructor(
    @InjectRepository(DemandeMateriel)
    private demandeRepo: Repository<DemandeMateriel>,
    @InjectRepository(Materiel)
    private materielRepo: Repository<Materiel>,
    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    private depenseService: DepenseService, // Inject DepenseService
  ) {}

  /**
   * Crée une nouvelle demande de matériel
   */
  async create(
    dto: CreateDemandeMaterielDto,
    user: User,
  ): Promise<DemandeMateriel> {
    // Charge les entités liées
    const materiel = await this.materielRepo.findOne({
      where: { id: dto.materielId },
    });
    const site = await this.siteRepo.findOne({
      where: { id: dto.siteId },
    });

    if (!materiel) {
      throw new NotFoundException(`Matériel ${dto.materielId} non trouvé`);
    }
    if (!site) {
      throw new NotFoundException(`Site ${dto.siteId} non trouvé`);
    }

    const demande = this.demandeRepo.create({
      materiel, //  Entité complète
      site, // ← Entité complète
      quantite: dto.quantite,
      motif: dto.motif,
      justificatifUrl: dto.justificatifUrl,
      demandeur: user,
      statut: StatutDemande.EN_ATTENTE, // ← Valeur par défaut
    });

    return await this.demandeRepo.save(demande);
  }

  /**
   * Liste toutes les demandes (optionnel: filtré par site)
   */
  async findAll(siteId?: string): Promise<DemandeMateriel[]> {
    const where: any = {};
    if (siteId) where.site = { id: siteId };

    return await this.demandeRepo.find({
      where,
      relations: ['demandeur', 'materiel', 'site'],
    });
  }

  /**
   * Récupère une demande par ID
   */
  async findOne(id: string): Promise<DemandeMateriel> {
    const demande = await this.demandeRepo.findOne({
      where: { id },
      relations: ['demandeur', 'materiel', 'site'],
    });
    if (!demande) {
      throw new NotFoundException(`Demande ${id} non trouvée`);
    }
    return demande;
  }

  /**
   * Met à jour une demande
   */
  async update(
    id: string,
    dto: UpdateDemandeMaterielDto,
  ): Promise<DemandeMateriel> {
    const demande = await this.findOne(id);
    Object.assign(demande, dto);
    return await this.demandeRepo.save(demande);
  }

  /**
   * Valide une demande (uniquement si EN_ATTENTE)
   */
  /* async valider(id: string): Promise<DemandeMateriel> {
    const demande = await this.findOne(id);
    if (demande.statut !== StatutDemande.EN_ATTENTE) {
      throw new BadRequestException(
        'Seules les demandes en attente peuvent être validées',
      );
    }
    demande.statut = StatutDemande.VALIDEE;
    return await this.demandeRepo.save(demande);
  }*/

  async valider(id: string): Promise<DemandeMateriel> {
    const demande = await this.findOne(id);
    if (demande.statut !== StatutDemande.EN_ATTENTE) {
      throw new BadRequestException(
        'Seules les demandes en attente peuvent être validées',
      );
    }

    // Mark the request as validated
    demande.statut = StatutDemande.VALIDEE;

    // Create the expense associated with this validated request
    await this.depenseService.createDepenseFromDemande(demande);

    return await this.demandeRepo.save(demande);
  }

  /**
   * Rejette une demande
   */
  async rejeter(id: string): Promise<DemandeMateriel> {
    const demande = await this.findOne(id);
    demande.statut = StatutDemande.REJETEE;
    return await this.demandeRepo.save(demande);
  }
}
