import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationService } from './registration/registration.service';
import { JwtUnauthGuard } from './guards/jwt-unauth.guard';
import { RegistrationResponse } from './registration/interfaces';

@Controller('api/client')
@UseGuards(JwtUnauthGuard)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('register')
  async register(
    @Body() registrationDto: RegistrationDto,
  ): Promise<RegistrationResponse> {
    return this.registrationService.register(registrationDto);
  }
}
