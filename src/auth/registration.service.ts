import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class RegistrationService {
  constructor(private readonly usersService: UsersService) {}

  async register(registrationDto: RegistrationDto): Promise<UserDocument> {
    const { email, password, name, contactPhone } = registrationDto;
    const user: UserDocument | null = await this.usersService.findByEmail(
      email,
    );
    if (user) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const passwordHash: string = await bcrypt.hash(password, 10);
    const newUser: UserDocument = await this.usersService.create({
      email,
      passwordHash,
      name,
      contactPhone,
    });
    if (!newUser) {
      throw new InternalServerErrorException('Пользователь не был создан');
    }
    return newUser;
  }
}
