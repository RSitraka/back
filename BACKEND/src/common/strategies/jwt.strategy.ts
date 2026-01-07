// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../user/enums/user-role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'password', // ← SECRET IDENTIQUE
    });
  }

  /**
   * Cette méthode est appelée après vérification du JWT
   * Elle remplit `req.user` avec les données du payload
   */
  async validate(payload: any) {
    // Retourne l'utilisateur pour req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole, // ← CRUCIAL POUR RolesGuard
    };
  }
}
