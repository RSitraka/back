import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Site } from '../site/site.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // Chemin ou URL du fichier

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Site, (site) => site.photos)
  site: Site;

  @CreateDateColumn()
  uploadedAt: Date;
}
