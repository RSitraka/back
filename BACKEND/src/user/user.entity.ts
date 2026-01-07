// src/user/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';
import { Depense } from '../depense/depense.entity';
import { UserRole } from './enums/user-role.enum';
import { Employe } from '../employe/employe.entity';
import { DemandeMateriel } from '../demande-materiel/demande-materiel.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { DemandeAvance } from '../demande-avance/demande-avance.entity';
import { DemandeBudget } from '../demande-budget/demande-budget.entity';

// src/user/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.EMPLOYE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  // relaition avec Employe (1-1)
  @OneToOne(() => Employe, (employe) => employe.user, {
    nullable: true,
    cascade: true,
  })
  employe?: Employe; // ou Employe | null

  // Site où est affecté l'utilisateur
  @ManyToOne(() => Site, (site) => site.users, { nullable: true })
  site?: Site;

  // --- RELATIONS AVEC DEPENSES ---

  // Dépenses validées par cet utilisateur (Finance)
  @OneToMany(() => Depense, (depense) => depense.user)
  depensesValidees: Depense[];

  // Dépenses créées par cet utilisateur (lors d'une demande d'achat)
  @OneToMany(() => Depense, (depense) => depense.demandeur)
  depensesCreees: Depense[];

  // D'autres relations déjà présentes :
  @OneToMany(() => DemandeAchat, (demande) => demande.demandeur)
  demandesAchat: DemandeAchat[];

  @OneToMany(() => DemandeAvance, (demande) => demande.demandeur)
  demandesAvance: DemandeAvance[];

  @OneToMany(() => DemandeMateriel, (demande) => demande.demandeur)
  demandesMateriel: DemandeMateriel[];

  @OneToMany(() => DemandeBudget, (demande) => demande.demandeur)
  demandesBudget: DemandeBudget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
