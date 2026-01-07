// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SeedAdminService } from '../seed/seed-admin.service';
import { Employe } from '../employe/employe.entity';
import { Site } from '../site/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employe, Site])],
  controllers: [UserController],
  providers: [UserService, SeedAdminService],
  exports: [UserService],
})
export class UserModule {}
