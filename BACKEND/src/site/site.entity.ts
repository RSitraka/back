import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employe } from '../employe/employe.entity';
import { Materiel } from '../materiel/materiel.entity';
import { Vehicule } from '../vehicule/vehicule.entity';
import { Depense } from '../depense/depense.entity';
import { Photo } from '../photo/photo.entity';
import { Fichier } from '../fichier/fichier.entity';
import { User } from '../user/user.entity';
import { DemandeMateriel } from '../demande-materiel/demande-materiel.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { DemandeAvance } from '../demande-avance/demande-avance.entity';
import { DemandeBudget } from '../demande-budget/demande-budget.entity';

export enum TypeTravail {
  CALIBRAGE = 'Calibrage',
  INSTALLATION = 'Installation',
  MAINTENANCE = 'Maintenance',
}

export enum StatutSite {
  EN_COURS = 'En cours',
  TERMINE = 'Terminé',
  SUSPENDU = 'Suspendu',
}

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    enum: TypeTravail,
  })
  typeTravail: TypeTravail;

  @Column()
  localisation: string;

  @Column('text')
  coordonneesGPS: string; // Peut stocker latitude,longitude

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'text',
    enum: StatutSite,
    default: StatutSite.EN_COURS,
  })
  statut: StatutSite;

  @OneToMany(() => Employe, (employe) => employe.site)
  employes: Employe[];

  @OneToMany(() => DemandeAvance, (demande) => demande.site, { nullable: true })
  demandesAvance: DemandeAvance[];

  @OneToMany(() => Materiel, (materiel) => materiel.site)
  materiels: Materiel[];

  @OneToMany(() => Vehicule, (vehicule) => vehicule.site)
  vehicules: Vehicule[];

  @OneToMany(() => Depense, (depense) => depense.site)
  depenses: Depense[];

  @OneToMany(() => DemandeAchat, (demande) => demande.site)
  demandesAchat: DemandeAchat[];

  @OneToMany(() => DemandeBudget, (demande) => demande.site)
  demandesBudget: DemandeBudget[];

  @OneToMany(() => Photo, (photo) => photo.site)
  photos: Photo[];

  @OneToMany(() => Fichier, (fichier) => fichier.site)
  fichiers: Fichier[];

  @OneToMany(() => DemandeMateriel, (demande) => demande.site)
  demandesMateriel: DemandeMateriel[];
  // RELATION INVERSE
  @OneToMany(() => User, (user) => user.site)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  static siteId: string;
}
