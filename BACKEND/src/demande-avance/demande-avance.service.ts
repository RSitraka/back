import { Depense } from './../depense/depense.entity';
// src/demande-avance/demande-avance.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandeAvance, StatutDemandeAvance } from './demande-avance.entity';
import { CreateDemandeAvanceDto } from './dto/create-demande-avance.dto';
import { UpdateDemandeAvanceDto } from './dto/update-demande-avance.dto';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';
import { DepenseService } from '../depense/depense.service';
import { TypeDepense } from '../depense/depense.entity';
import { Employe } from '../employe/employe.entity';

@Injectable()
export class DemandeAvanceService {
  constructor(
    @InjectRepository(DemandeAvance)
    private repo: Repository<DemandeAvance>,

    @InjectRepository(Employe)
    private employeRepo: Repository<Employe>,

    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    private depenseService: DepenseService,
  ) {}
  async create(
    dto: CreateDemandeAvanceDto,
    user: User,
  ): Promise<DemandeAvance> {
    // 1. Récupère le site si siteId fourni
    const site = dto.siteId
      ? await this.siteRepo.findOne({ where: { id: dto.siteId } })
      : null;

    if (dto.siteId && !site) {
      throw new NotFoundException(`Site ${dto.siteId} non trouvé`);
    }

    // 2. Crée d'abord sans les relations
    const demande = this.repo.create({
      montant: dto.montant,
      motif: dto.motif,
      statut: StatutDemandeAvance.EN_ATTENTE,
    });

    // 3. Assigner les relations après
    demande.demandeur = user;
    if (site) {
      demande.site = site;
    }

    return await this.repo.save(demande);
  }

  async findAll(siteId?: string): Promise<DemandeAvance[]> {
    const where: any = {};
    if (siteId) where.site = { id: siteId };

    return await this.repo.find({
      where,
      relations: ['demandeur', 'site'],
    });
  }

  async findOne(id: string): Promise<DemandeAvance> {
    const demande = await this.repo.findOne({
      where: { id },
      relations: ['demandeur', 'site'],
    });
    if (!demande) throw new NotFoundException(`Demande ${id} non trouvée`);
    return demande;
  }

  async update(
    id: string,
    dto: UpdateDemandeAvanceDto,
  ): Promise<DemandeAvance> {
    const demande = await this.findOne(id);
    Object.assign(demande, dto);
    return await this.repo.save(demande);
  }

  async valider(id: string): Promise<DemandeAvance> {
    const demande = await this.repo.findOne({
      where: { id },
      relations: ['demandeur', 'demandeur.employe', 'demandeur.site', 'site'],
    });

    if (!demande) {
      throw new NotFoundException(`Demande ${id} non trouvée`);
    }

    if (demande.statut !== StatutDemandeAvance.EN_ATTENTE) {
      throw new BadRequestException(
        'Seules les demandes en attente peuvent être validées',
      );
    }

    const employe = demande.demandeur.employe;
    if (!employe) {
      throw new BadRequestException(
        "Aucun employé n'est lié à cet utilisateur.",
      );
    }

    const salairePrestation = Number(employe.salaire); // Salaire de l'employé
    const avanceActuelle = Number(employe.avanceCumulee ?? 0); // Avance cumulée actuelle
    const demandeMontant = Number(demande.montant); // Montant de la demande

    const plafond = salairePrestation * 0.5; // Plafond de 50% du salaire
    const totalAfterDemand = avanceActuelle + demandeMontant;

    if (totalAfterDemand > plafond) {
      throw new BadRequestException(
        `Avance refusée. Maximum autorisé : ${plafond}, avance cumulée actuelle : ${avanceActuelle}`,
      );
    }

    // Mise à jour de l'avance cumulée
    employe.avanceCumulee = totalAfterDemand;

    // Calcul du reste de salaire après avance
    employe.resteSalaire = salairePrestation - totalAfterDemand;
    await this.employeRepo.save(employe); // Sauvegarder l'employé après la mise à jour

    // Création de la dépense liée
    const siteId = demande.site?.id ?? employe.site?.id;
    await this.depenseService.create({
      type: TypeDepense.SALAIRE,
      montant: demandeMontant,
      description: `Avance salaire : ${demande.motif}`,
      userId: demande.demandeur.id,
      siteId,
      employeId: employe.id,
    });

    demande.statut = StatutDemandeAvance.VALIDEE;
    return await this.repo.save(demande);
  }

  async rejeter(id: string): Promise<DemandeAvance> {
    const demande = await this.findOne(id);
    demande.statut = StatutDemandeAvance.REJETEE;
    return await this.repo.save(demande);
  }
}
