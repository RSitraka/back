import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';
import { Depense } from '../depense/depense.entity';
import { User } from '../user/user.entity';

@Entity('employes')
export class Employe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  adresse: string;

  @Column()
  numeroTelephone: string;

  @Column({ nullable: true })
  nationalite: string;

  @Column({ nullable: true })
  scanPhotoCIN: string;

  @Column({ nullable: true })
  scanCertificat: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  salaire: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  avanceCumulee: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  resteSalaire: number; // Salaire restant après avance

  // Relation avec User
  @OneToOne(() => User, (user) => user.employe)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation avec Site
  @ManyToOne(() => Site, (site) => site.employes, { nullable: true })
  @JoinColumn({ name: 'siteId' })
  site?: Site;

  // Relation inverse avec Depenses
  @OneToMany(() => Depense, (depense) => depense.employe)
  depenses: Depense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
