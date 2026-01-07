import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Site } from '../site/site.entity';
import { User } from '../user/user.entity';
import { Employe } from '../employe/employe.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Vehicule } from '../vehicule/vehicule.entity';

export enum TypeDepense {
  LOCATION_CARBURANT = 'Location + carburant de voiture',
  ACHAT_MATERIEL = 'achat_materiel',
  MATERIEL = 'Prix de matériels',
  SALAIRE = 'Salaire employé (avec avance)',
  DELOCBUDGET_ACHAT = 'Deblocage budget achat',
  AUTRE = 'Autre',
}

export enum PeriodeDepense {
  SEMAINE = 'semaine',
  MOIS = 'mois',
}

@Entity('depenses')
export class Depense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    enum: TypeDepense,
    default: TypeDepense.AUTRE,
  })
  type: TypeDepense;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    type: 'text',
    enum: PeriodeDepense,
    nullable: true,
  })
  periode?: PeriodeDepense;

  // --- Matériel (Demande Materiel) ---
  @ManyToOne(() => Materiel, { nullable: true })
  @JoinColumn({ name: 'materielId' })
  materiel?: Materiel;

  // --- Site concerné ---
  @ManyToOne(() => Site, { nullable: true })
  @JoinColumn({ name: 'siteId' })
  site?: Site;

  // --- Utilisateur qui valide la dépense (Finance, Admin, etc.) ---
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  // --- Utilisateur employé qui a créé la demande ---
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'demandeurId' })
  demandeur?: User;

  // --- Employé (table Employe) dans le cas d'avances & salaires ---
  @ManyToOne(() => Employe, { nullable: true })
  @JoinColumn({ name: 'employeId' })
  employe?: Employe;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.depense)
  vehicules: Vehicule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
