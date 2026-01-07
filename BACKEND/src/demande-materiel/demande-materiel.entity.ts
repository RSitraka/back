// src/demande-materiel/demande-materiel.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Site } from '../site/site.entity';

export enum StatutDemande {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}

@Entity('demandes_materiel')
export class DemandeMateriel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Materiel, (materiel) => materiel.demandes, {
    eager: false,
    nullable: false,
  })
  materiel: Materiel;

  @Column('int')
  quantite: number;

  @Column('text')
  motif: string;

  @Column({
    type: 'text',
    enum: StatutDemande,
    default: StatutDemande.EN_ATTENTE,
  })
  statut: StatutDemande;

  @Column({ nullable: true })
  justificatifUrl: string;

  @ManyToOne(() => User, (user) => user.demandesMateriel, {
    eager: false,
    nullable: false,
  })
  demandeur: User;

  @ManyToOne(() => Site, (site) => site.demandesMateriel, {
    eager: false,
    nullable: false,
  })
  site: Site;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
