import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';
import { Depense } from '../depense/depense.entity';
import { DemandeMateriel } from '../demande-materiel/demande-materiel.entity';

@Entity('materiels')
export class Materiel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nomFournisseur: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column()
  nom: string;

  @Column()
  modele: string;

  @ManyToOne(() => Site, (site) => site.materiels, { nullable: true })
  site: Site;

  @OneToMany(() => DemandeMateriel, (demande) => demande.materiel)
  demandes: DemandeMateriel[];

  @OneToMany(() => Depense, (depense) => depense.materiel)
  depenses: Depense[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
