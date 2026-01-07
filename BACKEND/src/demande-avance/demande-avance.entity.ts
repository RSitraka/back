// src/demande-avance/entities/demande-avance.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';

export enum StatutDemandeAvance {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}

@Entity('demandes_avance')
export class DemandeAvance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column('text')
  motif: string;

  @Column({
    type: 'text',
    enum: StatutDemandeAvance,
    default: StatutDemandeAvance.EN_ATTENTE,
  })
  statut: StatutDemandeAvance;

  @ManyToOne(() => User, (user) => user.demandesAvance)
  demandeur: User;

  @ManyToOne(() => Site, (site) => site.demandesAvance, { nullable: true })
  site: Site;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
