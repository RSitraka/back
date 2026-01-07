// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateEmployeDto } from '../employe/dto/create-employe.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as requestWithUserInterface from '../auth/interfaces/request-with-user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --- CRÉATION D’UN USER CLASSIQUE ---
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  findAll(@Query('siteId') siteId?: string) {
    if (siteId) return this.userService.findBySite(siteId);
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: requestWithUserInterface.RequestWithUser) {
    return this.userService.getMe(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
