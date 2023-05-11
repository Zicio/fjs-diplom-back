import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationService } from './registration.service';
import { JwtUnauthGuard } from './jwt-unauth.guard';

@Controller('api/client')
@UseGuards(JwtUnauthGuard)
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('register')
  async register(@Body() registrationDto: RegistrationDto) {
    return this.registrationService.register(registrationDto);
  }
}
