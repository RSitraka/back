// src/depense/depense.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depense, TypeDepense } from './depense.entity';
import { CreateDepenseDto } from './dto/create-depense.dto';
import { DemandeMateriel } from '../demande-materiel/demande-materiel.entity'; // Import DemandeMateriel entity
import { Site } from '../site/site.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Employe } from '../employe/employe.entity';
import { User } from '../user/user.entity';
import { Vehicule } from '../vehicule/vehicule.entity';

@Injectable()
export class DepenseService {
  constructor(
    @InjectRepository(Depense)
    private depenseRepository: Repository<Depense>,

    @InjectRepository(Site)
    private siteRepo: Repository<Site>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Employe)
    private employeRepo: Repository<Employe>,

    @InjectRepository(Materiel)
    private materielRepo: Repository<Materiel>,

    @InjectRepository(Vehicule)
    private vehiculeRepo: Repository<Vehicule>,
  ) {}

  async create(dto: CreateDepenseDto): Promise<Depense> {
    const depense = new Depense();

    depense.type = dto.type;
    depense.montant = dto.montant;
    depense.description = dto.description ?? null;

    // ---- SITE ----
    if (dto.siteId) {
      const site = await this.siteRepo.findOne({ where: { id: dto.siteId } });
      if (!site) throw new NotFoundException(`Site ${dto.siteId} non trouvé`);
      depense.site = site;
    }

    // ---- USER = valideur (Finance) ----
    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User ${dto.userId} non trouvé`);
      depense.user = user;
    }

    // ---- DEMANDEUR = employé qui a créé la demande d'achat ----
    if (dto.demandeurId) {
      const demandeur = await this.userRepo.findOne({
        where: { id: dto.demandeurId },
      });
      if (!demandeur)
        throw new NotFoundException(`Demandeur ${dto.demandeurId} non trouvé`);
      depense.demandeur = demandeur;
    }

    // ---- MATERIEL ----
    if (dto.materielId) {
      const materiel = await this.materielRepo.findOne({
        where: { id: dto.materielId },
      });
      if (!materiel)
        throw new NotFoundException(`Matériel ${dto.materielId} non trouvé`);
      depense.materiel = materiel;
    }

    // --- VEHICULE (optionnel pour la livraison) ---

    if (dto.vehiculeId) {
      const vehicule = await this.vehiculeRepo.findOne({
        where: { id: dto.vehiculeId },
      });
      if (!vehicule) {
        throw new NotFoundException(`Véhicule ${dto.vehiculeId} non trouvé`);
      }
    }

    // ---- ENREGISTREMENT ----
    return await this.depenseRepository.save(depense);
  }

  // Method to create an expense based on a validated material request
  async createDepenseFromDemande(
    demandeMateriel: DemandeMateriel,
  ): Promise<Depense> {
    // Ensure that the material and quantity exist
    if (!demandeMateriel.materiel || !demandeMateriel.quantite) {
      throw new NotFoundException('Matériel ou quantité non trouvée');
    }

    // Calculer le montant de la dépense
    const montant = demandeMateriel.materiel.prix * demandeMateriel.quantite;

    // Créer une dépense en utilisant l'entité Depense
    const depense = this.depenseRepository.create({
      montant: montant, // Le montant est le prix du matériel multiplié par la quantité demandée
      description: `Dépense pour le matériel : ${demandeMateriel.materiel.nom}`, // Description de la dépense
      site: demandeMateriel.site, // Lien avec le site associé à la demande
      materiel: demandeMateriel.materiel, // Lien avec le matériel associé
      type: TypeDepense.MATERIEL, // Type de dépense
    });

    // Sauvegarder la dépense dans la base de données
    return await this.depenseRepository.save(depense);
  }

  async findAll(): Promise<Depense[]> {
    return await this.depenseRepository.find({
      relations: ['site', 'materiel', 'employe', 'user'],
    });
  }
  async findOne(id: string): Promise<Depense> {
    const depense = await this.depenseRepository.findOne({
      where: { id },
      relations: ['site', 'materiel', 'employe', 'user'],
    });
    if (!depense) {
      throw new NotFoundException(`Dépense avec l'ID ${id} non trouvée`);
    }
    return depense;
  }

  async findBySite(siteId: string): Promise<Depense[]> {
    return await this.depenseRepository.find({
      where: { site: { id: siteId } },
      relations: ['site', 'materiel', 'employe', 'user'],
    });
  }

  async getMateriel(depenseId: string): Promise<any> {
    const depense = await this.findOne(depenseId);
    if (!depense.materiel) {
      throw new NotFoundException('Aucun matériel lié à cette dépense');
    }
    return depense.materiel;
  }

  async remove(id: string): Promise<void> {
    const result = await this.depenseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dépense avec l'ID ${id} non trouvée`);
    }
  }
}
