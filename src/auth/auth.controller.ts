import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtUnauthGuard } from './guards/jwt-unauth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('Авторизация пользователя')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @Post('login')
  @UseGuards(JwtUnauthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 204, description: 'Пустой ответ' })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res() res: Response,
    @Req() req: Request & { user: UserDocument },
  ): Promise<void> {
    return this.authService.logout(res, req);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Req() req: Request & { user: UserDocument },
    @Res() res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(
      req.user,
      req?.cookies['refresh_token'],
      res,
    );
  }
}
