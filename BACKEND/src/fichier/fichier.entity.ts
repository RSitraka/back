import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';

export enum TypeFichier {
  SCAN_FACTURE = 'Scan de facture',
  DOCUMENT = 'Document',
  AUTRE = 'Autre',
}

@Entity('Fichier')
export class Fichier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // Chemin ou URL du fichier

  @Column({
    type: 'text',
    enum: TypeFichier,
  })
  type: TypeFichier;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Site, (site) => site.fichiers)
  site: Site;

  @CreateDateColumn()
  uploadedAt: Date;
}
