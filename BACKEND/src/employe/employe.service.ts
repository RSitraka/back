// src/employe/employe.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employe } from './employe.entity';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';

import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enums/user-role.enum';
import { Fichier, TypeFichier } from '../fichier/fichier.entity';
import { FichierService } from '../fichier/fichier.service';

@Injectable()
export class EmployeService {
  constructor(
    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,

    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Fichier) private fichierRepository: Repository<Fichier>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    private readonly fichierService: FichierService,
  ) { }

  async create(dto: CreateEmployeDto): Promise<User> {
    // Vérifier email unique
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email déjà utilisé');

    // Charger le site si fourni
    const site = dto.siteId
      ? await this.siteRepository.findOne({ where: { id: dto.siteId } })
      : null;

    if (dto.siteId && !site) {
      throw new NotFoundException(`Site ${dto.siteId} non trouvé`);
    }

    // Hacher le mot de passe
    const hashed = await bcrypt.hash(dto.password, 10);

    // 1. Créer le User
    const user = this.userRepository.create({
      email: dto.email,
      password: hashed,
      nom: dto.nom,
      prenom: dto.prenom,
      role: UserRole.EMPLOYE,
      isActive: true,
      site: site ?? undefined, // ← TypeScript OK
    });

    const savedUser = await this.userRepository.save(user);

    // 2. Créer l'Employe
    const employe = this.employeRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      //prenom: dto.prenom,
      adresse: dto.adresse,
      numeroTelephone: dto.numeroTelephone,
      nationalite: dto.nationalite,
      salaire: dto.salaire ?? 0,
      user: savedUser,
      site: site ?? undefined,
    });
    await this.employeRepository.save(employe);

    // 3. Recharger l'utilisateur avec la relation employe
    const userWithEmploye = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['employe', 'site'],
    });

    if (!userWithEmploye) {
      throw new NotFoundException('Utilisateur créé mais introuvable');
    }

    return userWithEmploye;
  }

  async findAll(): Promise<Employe[]> {
    return await this.employeRepository.find({
      relations: ['site'],
    });
  }

  async findOne(id: string): Promise<Employe> {
    const employe = await this.employeRepository.findOne({
      where: { id },
      relations: ['site', 'depenses', 'scanCertificats', 'scanPhotoCIN'],
    });
    if (!employe) throw new NotFoundException(`Employé ${id} non trouvé`);
    return employe;
  }

  async findBySite(siteId: string): Promise<Employe[]> {
    return await this.employeRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }

  async update(
    id: string,
    dto: UpdateEmployeDto,
    certificats?: Express.Multer.File[],
    photo?: Express.Multer.File[]
  ): Promise<Employe> {
    const employe = await this.findOne(id);
    if (certificats?.length) {
      const fichiers = certificats.map(file =>
        this.fichierRepository.create({
          url: file.path.replace(/\\/g, '/'),
          type: TypeFichier.DOCUMENT,
          originalName: file.originalname,
        }),
      );
      const savedFichiers = await this.fichierRepository.save(fichiers);
      employe.scanCertificats ??= [];
      employe.scanCertificats.push(...savedFichiers);
    }
    if (photo?.length) {
      const f = this.fichierRepository.create({
        url: photo[0].path.replace(/\\/g, '/'),
        type: TypeFichier.DOCUMENT,
        originalName: photo[0].originalname,
      });
      if (employe.scanPhotoCIN?.id) {
        await this.fichierService.remove(employe.scanPhotoCIN.id);
      }
      employe.scanPhotoCIN = await this.fichierRepository.save(f);
    }
    Object.assign(employe, dto);
    return await this.employeRepository.save(employe);
  }


  async remove(id: string) {
    const employe = await this.findOne(id);
    if (employe.scanCertificats?.length) {
      for (const fichier of employe.scanCertificats)
        await this.fichierService.remove(fichier.id);
    }
    if (employe.scanPhotoCIN)
      await this.fichierService.remove(employe.scanPhotoCIN.id);
    if (employe.user)
      await this.userRepository.remove(employe.user);
    await this.employeRepository.remove(employe);
  }


  async removecertificats(employeId: string, fileId: string) {
    const employe = await this.findOne(employeId);
    if (!employe.scanCertificats) return employe;

    const scanCertificats = employe.scanCertificats.filter(f => f.id === fileId);
    employe.scanCertificats = employe.scanCertificats.filter(f => f.id !== fileId);
    if (!scanCertificats.length)
      return (new NotFoundException("Fichier Introuvable"));
    await this.fichierService.remove(scanCertificats[0].id);
    return this.employeRepository.save(employe);
  }

  async removePhotos(employeId: string, photoId: string) {
    const employe = await this.findOne(employeId);
    if (!employe.scanPhotoCIN || photoId !== employe.scanPhotoCIN.id)
      return (new NotFoundException("image introuvable"));
    employe.scanPhotoCIN = null;
    await this.fichierService.remove(photoId);
    return this.employeRepository.save(employe);
  }


  async getCertificats(id: string) {
    const employe = await this.findOne(id);
    let files = employe.scanCertificats;
    return files;
  }
}
