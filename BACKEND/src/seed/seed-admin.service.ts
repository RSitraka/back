// src/seed/seed-admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class SeedAdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async seed() {
    const adminEmail = 'admin@master2.mg';
    const existing = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (existing) {
      console.log('Admin déjà créé');
      return;
    }

    const hashed = await bcrypt.hash('Admin2025!', 10);

    const admin = this.userRepo.create({
      email: adminEmail,
      password: hashed,
      role: UserRole.ADMIN,
      nom: 'ADMIN_OK',
      prenom: 'Master2',
      isActive: true,
    });

    await this.userRepo.save(admin);
    console.log('Premier ADMIN créé :', adminEmail);
  }
}
