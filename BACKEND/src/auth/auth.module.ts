// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; // ← DOIT ÊTRE ICI
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'ton-secret-super-secret-2025',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController], // ← OBLIGATOIRE
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
