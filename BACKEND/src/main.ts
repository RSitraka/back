// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/role.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { SeedAdminService } from './seed/seed-admin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  // Guards globaux avec Reflector injecté
  app.useGlobalGuards(
    new JwtAuthGuard(reflector), // JWT + @Public() support
    new RolesGuard(reflector), // Vérifie les rôles
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // SEED ADMIN
  /* const seedService = app.get(SeedAdminService);
  await seedService.seed();
*/
  // RÉCUPÈRE DEPUIS UserModule
  const seedService = app.get(SeedAdminService);
  await seedService.seed();
  // Préfixe API pour les routes
  app.setGlobalPrefix('api');

  // Port
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Logs
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log('JWT_SECRET chargé:', process.env.JWT_SECRET);
}
bootstrap();
