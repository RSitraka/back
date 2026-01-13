// src/Photo/Photo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ft_delete } from '../utils/utils';
import { SiteService } from '../site/site.service';
//import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private PhotoRepository: Repository<Photo>,
    private readonly siteService: SiteService
  ) { }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const site = await this.siteService.findOne(createPhotoDto.siteId);
    if (!site) {
      throw new NotFoundException('Site introuvable');
    }
    const Photo = this.PhotoRepository.create({
      ...createPhotoDto,
      site: { id: createPhotoDto.siteId },
    });
    return await this.PhotoRepository.save(Photo);
  }

  async findAll(): Promise<Photo[]> {
    return await this.PhotoRepository.find({
      relations: ['site', 'depenses'],
    });
  }

  async findOne(id: string): Promise<Photo> {
    const Photo = await this.PhotoRepository.findOne({
      where: { id },
      relations: ['site'],
    });
    if (!Photo) {
      throw new NotFoundException(`Image non trouvable`);
    }
    return Photo;
  }

  async findBySite(siteId: string): Promise<Photo[]> {
    return await this.PhotoRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }

  /*async update(
    id: string,
    updatePhotoDto: UpdatePhotoDto,
  ): Promise<Photo> {
    const Photo = await this.findOne(id);
    Object.assign(Photo, updatePhotoDto);
    return await this.PhotoRepository.save(Photo);
  }*/

  async remove(id: string): Promise<void> {
    const photo = await this.PhotoRepository.findOne({
      where: { id },
    });
    if (!photo) {
      throw new NotFoundException('Image introuvable');
    }
    const photoUrl = photo.url;
    ft_delete(photoUrl);
    await this.PhotoRepository.delete(id);
  }

}
