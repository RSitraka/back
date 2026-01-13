// src/employe/employe.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmployeService } from './employe.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../user/enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptionsEmployes, multerOptionsFiles } from '../config/multer/config';

@Controller('employes')
export class EmployeController {
  constructor(private readonly employeService: EmployeService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.EMPLOYE, UserRole.ADMIN)
  create(@Body() dto: CreateEmployeDto) {
    return this.employeService.create(dto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) return this.employeService.findBySite(siteId);
    return this.employeService.findAll();
  }
  @Get('/certificats/:id')
  async findCertificats(@Param('id') id: string) {
    return this.employeService.getCertificats(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'certificats', maxCount: 10 },
    { name: 'photo', maxCount: 1 },
  ], multerOptionsEmployes))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeDto,
    @UploadedFiles() files: { certificats?: Express.Multer.File[], photo?: Express.Multer.File[] },
  ) {
    return this.employeService.update(id, dto, files.certificats, files.photo);
  }


  @Delete('/certificats/:id/:fileId')
  removecertificats(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
  ) {
    return this.employeService.removecertificats(id, fileId);
  }
  @Delete('/photos/:id/:fileId')
  removePhotos(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
  ) {
    return this.employeService.removePhotos(id, fileId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeService.remove(id);
  }
}
