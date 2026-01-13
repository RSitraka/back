import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { SiteService } from '../site/site.service';
import { SiteModule } from '../site/site.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    SiteModule,
  ],  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule { }
