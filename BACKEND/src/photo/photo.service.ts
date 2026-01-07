// src/Photo/Photo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
//import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private PhotoRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const Photo = this.PhotoRepository.create(createPhotoDto);
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
      relations: ['site', 'depenses'],
    });
    if (!Photo) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
    return Photo;
  }

  async findBySite(siteId: string): Promise<Photo[]> {
    return await this.PhotoRepository.find({
      where: { site: { id: siteId } },
      relations: ['depenses'],
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
    const result = await this.PhotoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employé avec l'ID ${id} non trouvé`);
    }
  }
}
