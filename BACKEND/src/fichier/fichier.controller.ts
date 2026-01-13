import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FichierService } from '../fichier/fichier.service'; // Adjusted import path
import type { Response } from 'express';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { UpdateFichierDto } from './dto/update-fichier.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsFiles } from '../config/multer/config';

@Controller('fichiers')
export class FichierController {
  constructor(private readonly FichierService: FichierService) { }

  @Post()
  @UseInterceptors(FileInterceptor('pdf', multerOptionsFiles))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFichierDto,
  ) {
    dto.url = file.path.replace(/\\/g, '/');
    dto.originalName = file.originalname;
    return this.FichierService.create(dto);
  }


  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) {
      return this.FichierService.findBySite(siteId);
    }
    return this.FichierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.FichierService.findOne(id);
  }

  @Get('/download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.FichierService.findOne(id);
    if (!file) {
      throw new NotFoundException();
    }
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.originalName}"`
    );

    return res.sendFile(file.url, { root: './' });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.FichierService.remove(id);
  }
}
