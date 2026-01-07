import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandeBudget, StatutDemande } from './demande-budget.entity';
import { CreateDemandeBudgetDto } from './dto/create-demande-budget.dto';
import { UpdateDemandeBudgetDto } from './dto/update-demande-budget.dto';
import { Site } from '../site/site.entity';
import { User } from '../user/user.entity';
import { Depense } from '../depense/depense.entity';
import { TypeDepense } from '../depense/depense.entity';
import { DepenseService } from '../depense/depense.service';

@Injectable()
export class DemandeBudgetService {
  constructor(
    @InjectRepository(DemandeBudget)
    private readonly demandeRepo: Repository<DemandeBudget>,

    @InjectRepository(Depense)
    private readonly depenseService: DepenseService,
  ) {}

  async create(dto: CreateDemandeBudgetDto) {
    const demande = this.demandeRepo.create({
      motif: dto.motif,
      montant: dto.montant,
      site: { id: dto.siteId } as Site,
      demandeur: { id: dto.demandeurId } as User,
    });
    return this.demandeRepo.save(demande);
  }

  async findAll() {
    return this.demandeRepo.find();
  }

  async findOne(id: string) {
    const demande = await this.demandeRepo.findOne({ where: { id } });
    if (!demande) throw new NotFoundException('Demande non trouvée');
    return demande;
  }

  // Méthode pour valider une demande de budget
  async valider(
    id: string,
    dto: UpdateDemandeBudgetDto, //  Accepter le DTO complet
    valideurId: string,
  ): Promise<DemandeBudget> {
    const demande = await this.demandeRepo.findOne({ where: { id } });
    if (!demande) {
      throw new NotFoundException('Demande non trouvée');
    }

    // Vérifier que le statut est fourni
    if (!dto.statut) {
      throw new BadRequestException(
        'Le statut est obligatoire pour la validation',
      );
    }

    demande.statut = dto.statut;
    demande.valideur = { id: valideurId } as User;
    console.log('Statut de la demande:', dto.statut);
    console.log('ID du valideur:', valideurId);

    const updated = await this.demandeRepo.save(demande);

    // Si la demande est validée, créer une dépense
    if (updated.statut === StatutDemande.APPROUVEE) {
      await this.depenseService.create({
        type: TypeDepense.ACHAT_MATERIEL,
        montant: updated.montant,
        description: `Budget débloqué pour ${updated.motif}`,
        siteId: updated.site.id,
        userId: valideurId, // LE VALIDEUR (FINANCE) QUI APPROUVE
      });
    }

    return updated;
  }
}
