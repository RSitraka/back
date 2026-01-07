import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';
import { User } from '../user/user.entity';

export enum StatutDemande {
  EN_ATTENTE = 'en_attente',
  APPROUVEE = 'approuvee',
  REJETEE = 'rejetee',
}

@Entity('demandes_budget')
export class DemandeBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  motif: string;

  @Column('decimal', { precision: 12, scale: 2 })
  montant: number;

  @Column({
    type: 'text',
    enum: StatutDemande,
    default: StatutDemande.EN_ATTENTE,
  })
  statut: StatutDemande;

  @ManyToOne(() => Site, (site) => site.demandesBudget, { eager: true })
  site: Site;

  @ManyToOne(() => User, (user) => user.demandesBudget, { eager: true })
  demandeur: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  valideur?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
