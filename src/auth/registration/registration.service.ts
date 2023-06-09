import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { RegistrationDto } from '../dto/registration.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../users/schemas/user.schema';
import { RegistrationResponse } from './interfaces';

@Injectable()
export class RegistrationService {
  constructor(private readonly usersService: UsersService) {}

  async register(
    registrationDto: RegistrationDto,
  ): Promise<RegistrationResponse> {
    try {
      const { password, email, ...rest } = registrationDto;
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
        passwordHash,
        email,
        ...rest,
      });
      return { id: newUser._id, email: newUser.email, name: newUser.name };
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        'Произошла ошибка при создании пользователя',
      );
    }
  }
}
