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

@Injectable()
export class EmployeService {
  constructor(
    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,

    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
  ) {}

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
      scanPhotoCIN: dto.scanPhotoCIN,
      scanCertificat: dto.scanCertificat,
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
      relations: ['site', 'depenses'],
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

  async update(id: string, dto: UpdateEmployeDto): Promise<Employe> {
    const employe = await this.findOne(id);
    Object.assign(employe, dto);
    return await this.employeRepository.save(employe);
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employé ${id} non trouvé`);
    }
  }
}
