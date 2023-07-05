import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { JwtUnauthGuard } from './guards/jwt-unauth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegistrationResponseDto } from './dto/registration-response.dto';

@ApiTags('Регистрация пользователя')
@Controller('api/client')
@UseGuards(JwtUnauthGuard)
export class RegistrationController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 201, type: RegistrationResponseDto })
  @Post('register')
  async register(
    @Body() registrationDto: RegistrationDto,
  ): Promise<RegistrationResponseDto> {
    return this.authService.register(registrationDto);
  }
}
