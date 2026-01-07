// src/demande-achat/demande-achat.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandeAchat, StatutDemandeAchat } from './demande-achat.entity';
import { CreateDemandeAchatDto } from './dto/create-demande-achat.dto';
import { UpdateDemandeAchatDto } from './dto/update-demande-achat.dto';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';
import { DepenseService } from '../depense/depense.service';
import { TypeDepense } from '../depense/depense.entity';
import { DemandeBudgetService } from '../demande-budget/demande-budget.service';
import { Materiel } from '../materiel/materiel.entity';

@Injectable()
export class DemandeAchatService {
  constructor(
    @InjectRepository(DemandeAchat)
    private repo: Repository<DemandeAchat>,

    @InjectRepository(Site)
    private siteRepo: Repository<Site>,

    @InjectRepository(Materiel)
    private materielRepo: Repository<Materiel>,

    private depenseService: DepenseService,
    private demandeBudgetService: DemandeBudgetService,
  ) {}

  // ---------------------------------------------------------------
  // CRÉATION D’UNE DEMANDE D’ACHAT
  // ---------------------------------------------------------------
  async create(dto: CreateDemandeAchatDto, user: User): Promise<DemandeAchat> {
    const site = await this.siteRepo.findOne({ where: { id: dto.siteId } });
    if (!site) throw new NotFoundException(`Site ${dto.siteId} non trouvé`);

    const demande = this.repo.create({
      ...dto,
      demandeur: user,
      site,
      statut: StatutDemandeAchat.EN_ATTENTE,
    });

    const created = await this.repo.save(demande);

    // Création automatique d’une demande de budget
    await this.demandeBudgetService.create({
      motif: `Demande d'achat pour ${created.nom}`,
      montant: created.prixEstime,
      siteId: created.site.id,
      demandeurId: created.demandeur.id,
    });

    return created;
  }

  // ---------------------------------------------------------------
  // VALIDATION D’UNE DEMANDE D’ACHAT
  // ---------------------------------------------------------------
  async valider(id: string, valideur: User): Promise<DemandeAchat> {
    const demande = await this.findOne(id);

    if (demande.statut !== StatutDemandeAchat.EN_ATTENTE) {
      throw new BadRequestException('Cette demande n’est pas en attente.');
    }

    demande.statut = StatutDemandeAchat.VALIDEE;

    // ----------  Vérifier si le matériel existe ----------
    // Vérifier si le matériel existe déjà
    let materiel = await this.materielRepo.findOne({
      where: { nom: demande.nom, modele: demande.modele },
    });

    // Si le matériel n'existe pas alors on le créer
    if (!materiel) {
      materiel = this.materielRepo.create({
        nom: demande.nom,
        modele: demande.modele,
        prix: demande.prixEstime,
        nomFournisseur: demande.fournisseur || 'Inconnu',
        site: demande.site, // associer le matériel au site
      });

      materiel = await this.materielRepo.save(materiel);
    }

    // ----------  Créer la dépense automatiquement ----------
    await this.depenseService.create({
      type: TypeDepense.ACHAT_MATERIEL,
      montant: demande.prixEstime,
      description: `Déblocage budget achat : ${demande.nom} ${demande.modele || ''}`,
      siteId: demande.site.id,
      demandeurId: demande.demandeur.id, // L'employé
      userId: valideur.id, // Le valideur FINANCE
      materielId: materiel.id, // Très important
    });

    // ---------- Sauvegarder la demande ----------
    return await this.repo.save(demande);
  }

  // ---------------------------------------------------------------
  async findAll(siteId?: string): Promise<DemandeAchat[]> {
    const where: any = {};
    if (siteId) where.site = { id: siteId };

    return await this.repo.find({
      where,
      relations: ['demandeur', 'site'],
    });
  }

  async findOne(id: string): Promise<DemandeAchat> {
    const demande = await this.repo.findOne({
      where: { id },
      relations: ['demandeur', 'site'],
    });
    if (!demande) throw new NotFoundException(`Demande ${id} non trouvée`);
    return demande;
  }

  async update(id: string, dto: UpdateDemandeAchatDto): Promise<DemandeAchat> {
    const demande = await this.findOne(id);
    Object.assign(demande, dto);
    return await this.repo.save(demande);
  }

  async rejeter(id: string): Promise<DemandeAchat> {
    const demande = await this.findOne(id);
    demande.statut = StatutDemandeAchat.REJETEE;
    return await this.repo.save(demande);
  }
}
