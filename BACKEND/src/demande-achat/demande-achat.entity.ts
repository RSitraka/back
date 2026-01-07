// src/demande-achat/entities/demande-achat.entity.ts
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

export enum StatutDemandeAchat {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
}

@Entity('demandes_achat')
export class DemandeAchat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  modele: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prixEstime: number;

  @Column()
  fournisseur: string;

  @Column('text')
  description: string;

  @Column({
    type: 'text',
    enum: StatutDemandeAchat,
    default: StatutDemandeAchat.EN_ATTENTE,
  })
  statut: StatutDemandeAchat;

  @ManyToOne(() => User, (user) => user.demandesAchat)
  demandeur: User;

  @ManyToOne(() => Site, (site) => site.demandesAchat)
  site: Site;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  valideur: any;
}
