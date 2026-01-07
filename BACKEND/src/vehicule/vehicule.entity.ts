import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Site } from '../site/site.entity';
import { Depense } from '../depense/depense.entity';

@Entity('vehicules')
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numeroMatricule: string;

  @Column('decimal', { precision: 10, scale: 2 })
  montantDepenseCarburant: number;

  @Column()
  nomMarque: string;

  @Column({ nullable: true })
  nomAgence?: string;

  @Column()
  numeroTelephoneConducteur: string;

  @ManyToOne(() => Site, (site) => site.vehicules, { nullable: true })
  @JoinColumn({ name: 'siteId' })
  site?: Site;

  // ✔ Relation correcte vers dépense
  @ManyToOne(() => Depense, (depense) => depense.vehicules, { nullable: true })
  @JoinColumn({ name: 'depenseId' })
  depense?: Depense;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
