import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
//import { UpdatephotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsPhotos } from '../config/multer/config';

@Controller('photos')
export class PhotoController {
  constructor(private readonly PhotoService: PhotoService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptionsPhotos))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePhotoDto,
  ) {
    dto.url = file.path.replace(/\\/g, '/');
    dto.originalName = file.originalname;
    return this.PhotoService.create(dto);
  }
  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.PhotoService.findBySite(siteId);
    }
    return this.PhotoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PhotoService.findOne(id);
  }

  /*@Patch(':id')
    update(@Param('id') id: string, @Body() updatephotoDto: UpdatephotoDto) {
      return this.PhotoService.update(id, updatephotoDto);
    }*/

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PhotoService.remove(id);
  }
  @Get('/download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const photo = await this.PhotoService.findOne(id);
    if (!photo) {
      throw new NotFoundException();
    }
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${photo.originalName}"`
    );

    return res.sendFile(photo.url, { root: './' });
  }
}
