// src/employe/employe.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { Employe } from './employe.entity';
import { User } from '../user/user.entity';
import { Site } from '../site/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employe, User, Site])],
  controllers: [EmployeController],
  providers: [EmployeService],
  exports: [EmployeService],
})
export class EmployeModule {}
