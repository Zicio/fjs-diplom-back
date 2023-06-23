import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';
import { GetUsersDto } from './dto/getUsers.dto';
import { ICreateUserResponse, IGetUsersResponse } from './interfaces';

@Injectable()
export class UserManagementApiService {
  constructor(private readonly usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto): Promise<ICreateUserResponse> {
    try {
      const { password, email, ...rest } = createUserDto;
      const user: UserDocument | null = await this.usersService.findByEmail(
        email,
      );
      if (user) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует',
        );
      }
      const passwordHash: string = await bcrypt.hash(password, 10);
      const {
        id,
        email: newUserEmail,
        name,
        contactPhone,
        role,
      } = await this.usersService.create({
        passwordHash,
        email,
        ...rest,
      });
      return {
        id,
        email: newUserEmail,
        name,
        contactPhone,
        role,
      };
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        'Ошибка при создании пользователя',
      );
    }
  }

  async getUsers(params: GetUsersDto): Promise<IGetUsersResponse[]> {
    try {
      const users: UserDocument[] = await this.usersService.findAll(params);
      return users.map((user: UserDocument) => {
        const { id, email, name, contactPhone } = user;
        return {
          id,
          email,
          name,
          contactPhone,
        };
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e;
      }
      throw new InternalServerErrorException(
        'Ошибка при получении пользователей',
      );
    }
  }
}
