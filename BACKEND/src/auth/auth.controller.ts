// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '.././common/decorators/pulbic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public() // EXCLUT DU JWT
  async login(@Body() dto: LoginDto) {
    console.log('mandalo ato am controller');
    return this.authService.login(dto);
  }
}
