import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtUnauthGuard } from '../guards/jwt-unauth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(JwtUnauthGuard)
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response): Promise<void> {
    return this.authService.logout(res);
  }
}
