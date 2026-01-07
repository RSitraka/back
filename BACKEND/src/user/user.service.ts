// src/user/user.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Employe } from '../employe/employe.entity';
import { CreateEmployeDto } from '../employe/dto/create-employe.dto';

import { Site } from '../site/site.entity';
import { UserRole } from './enums/user-role.enum';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,

    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  // -------------------------------------------------------
  // 1) CRÉATION D’UN USER CLASSIQUE
  // -------------------------------------------------------
  async createUser(dto: CreateUserDto): Promise<User> {
    // Vérifier email unique
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email déjà utilisé');

    // Charger site si fourni
    let site: Site | null = null;
    if (dto.siteId) {
      site = await this.siteRepository.findOne({
        where: { id: dto.siteId },
      });
      if (!site) throw new NotFoundException(`Site ${dto.siteId} non trouvé`);
    }

    // Hacher mot de passe
    const hashed = await bcrypt.hash(dto.password, 10);

    // Création user
    const user = this.userRepository.create({
      email: dto.email,
      password: hashed,
      nom: dto.nom,
      prenom: dto.prenom,
      role: dto.role, // ADMIN, FINANCE, LOGISTIC...
      isActive: true,
      site: site ?? undefined,
    });

    return this.userRepository.save(user);
  }

  // -------------------------------------------------------
  // AUTRES MÉTHODES
  // -------------------------------------------------------

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['site', 'employe'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['site', 'employe'],
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email non trouvé');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }

  async findBySite(siteId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'employe',
        'site',
        'demandesAchat',
        'demandesMateriel',
        'demandesAvance',
      ],
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }
}
