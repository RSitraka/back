// src/auth/auth.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '.././common/decorators/pulbic.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
      path: "/"
    });

    return {
      user: result.user,
    };
  }
}
