import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationService } from './registration.service';

@Controller('api/client')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('register')
  async register(@Body() registrationDto: RegistrationDto) {
    return this.registrationService.register(registrationDto);
  }
}
