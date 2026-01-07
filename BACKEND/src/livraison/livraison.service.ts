import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Livraison, StatutLivraison } from './livraison.entity';
import { CreateLivraisonDto } from './dto/create-livraison.dto';
import { UpdateLivraisonDto } from './dto/update-livraison.dto';

import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Vehicule } from '../vehicule/vehicule.entity';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';

import { Depense, TypeDepense } from '../depense/depense.entity';

@Injectable()
export class LivraisonService {
  constructor(
    @InjectRepository(Livraison)
    private readonly repo: Repository<Livraison>,

    @InjectRepository(DemandeAchat)
    private readonly demandeAchatRepo: Repository<DemandeAchat>,

    @InjectRepository(Vehicule)
    private readonly vehiculeRepo: Repository<Vehicule>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Site)
    private readonly siteRepo: Repository<Site>,

    @InjectRepository(Depense)
    private readonly depenseRepo: Repository<Depense>,
  ) {}

  // -----------------------------------------
  //  Calcul automatique du coût de livraison
  // -----------------------------------------
  private calculerCoutLivraison(vehicule: Vehicule): number {
    const coutCarburant = Number(vehicule.montantDepenseCarburant) || 0;
    const fraisFixe = 25000; // configurable plus tard
    return coutCarburant + fraisFixe;
  }

  // -----------------------------------------
  //  CRÉATION D’UNE LIVRAISON
  // -----------------------------------------
  async create(dto: CreateLivraisonDto): Promise<Livraison> {
    const demandeAchat = await this.demandeAchatRepo.findOne({
      where: { id: dto.demandeAchatId },
      relations: ['demandeur', 'site'],
    });
    if (!demandeAchat) {
      throw new NotFoundException(
        `DemandeAchat ${dto.demandeAchatId} introuvable`,
      );
    }

    if (demandeAchat.statut !== 'VALIDEE') {
      throw new BadRequestException(
        `La demande d’achat doit être validée avant d’être livrée.`,
      );
    }

    const vehicule = await this.vehiculeRepo.findOne({
      where: { id: dto.vehiculeId },
    });
    if (!vehicule) {
      throw new NotFoundException(`Véhicule ${dto.vehiculeId} introuvable`);
    }

    const site = await this.siteRepo.findOne({
      where: { id: dto.siteId },
    });
    if (!site) {
      throw new NotFoundException(`Site ${dto.siteId} introuvable`);
    }

    const livraison = this.repo.create({
      demandeAchat,
      vehicule,
      site,
      statut: dto.statut ?? StatutLivraison.EN_ATTENTE,
      dateDepart: dto.dateDepart ? new Date(dto.dateDepart) : null,
      dateArrivee: null,
    });

    return await this.repo.save(livraison);
  }

  // -----------------------------------------
  //  VALIDATION D’UNE LIVRAISON
  //  et Génère automatiquement une dépense
  // -----------------------------------------
  async valider(id: string, valideur: User): Promise<Livraison> {
    const livraison = await this.repo.findOne({
      where: { id },
      relations: ['vehicule', 'demandeAchat', 'demandeAchat.demandeur', 'site'],
    });

    if (!livraison) throw new NotFoundException('Livraison introuvable');

    if (livraison.statut !== StatutLivraison.EN_ATTENTE) {
      throw new BadRequestException(
        'Seules les livraisons EN_ATTENTE peuvent être validées.',
      );
    }

    // Marquer la livraison comme EN_ROUTE
    livraison.statut = StatutLivraison.EN_ROUTE;
    livraison.dateDepart = new Date();

    //  Calcul du coût de livraison
    const cout = this.calculerCoutLivraison(livraison.vehicule);

    //  Création automatique de la dépense
    const depense = this.depenseRepo.create({
      type: TypeDepense.LOCATION_CARBURANT,
      montant: cout,
      description: `Livraison de ${livraison.demandeAchat.nom} via véhicule ${livraison.vehicule.numeroMatricule}`,
      site: livraison.site,
      user: valideur, // Finance qui valide
      demandeur: livraison.demandeAchat.demandeur, // employé qui a fait la demande
    });

    await this.depenseRepo.save(depense);

    return await this.repo.save(livraison);
  }

  // -----------------------------------------
  //  UPDATE
  // -----------------------------------------
  async update(id: string, dto: UpdateLivraisonDto): Promise<Livraison> {
    const livraison = await this.repo.findOne({ where: { id } });
    if (!livraison) throw new NotFoundException('Livraison introuvable');

    if (dto.statut) livraison.statut = dto.statut;
    if (dto.dateArrivee) livraison.dateArrivee = new Date(dto.dateArrivee);

    return this.repo.save(livraison);
  }

  // -----------------------------------------
  //  FIND ALL
  // -----------------------------------------
  async findAll() {
    return this.repo.find({
      relations: ['vehicule', 'site', 'demandeAchat'],
    });
  }

  // -----------------------------------------
  //  FIND ONE
  // -----------------------------------------
  async findOne(id: string) {
    const livraison = await this.repo.findOne({
      where: { id },
      relations: ['vehicule', 'site', 'demandeAchat'],
    });

    if (!livraison) throw new NotFoundException('Livraison introuvable');
    return livraison;
  }
}
