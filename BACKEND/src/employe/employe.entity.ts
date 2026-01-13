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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Site } from '../site/site.entity';
import { Depense } from '../depense/depense.entity';
import { User } from '../user/user.entity';
import { Fichier } from '../fichier/fichier.entity';

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

  @ManyToMany(() => Fichier, { cascade: true })
  @JoinTable({
    name: 'employe_certificats',
    joinColumn: { name: 'employeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'fichierId', referencedColumnName: 'id' },
  })
  scanCertificats: Fichier[];

  @ManyToOne(() => Fichier, { nullable: true, cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  scanPhotoCIN?: Fichier | null;




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
