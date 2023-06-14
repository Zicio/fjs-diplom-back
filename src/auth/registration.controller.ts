import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { JwtUnauthGuard } from './guards/jwt-unauth.guard';
import { AuthService } from './auth.service';
import { RegistrationResponse } from './interfaces';

@Controller('api/client')
@UseGuards(JwtUnauthGuard)
export class RegistrationController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registrationDto: RegistrationDto,
  ): Promise<RegistrationResponse> {
    return this.authService.register(registrationDto);
  }
}
