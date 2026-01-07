import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const password = configService.get<string>('DB_PASSWORD');

  console.log('DB_PASSWORD:', password, '| Type:', typeof password); // DEBUG

  return {
    type: 'sqlite',
    database: 'data.sqlite',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: configService.get<string>('NODE_ENV') === 'development',
    autoLoadEntities: true,
  };
};
