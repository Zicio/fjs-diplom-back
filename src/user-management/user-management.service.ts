import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';
import { QueryParams } from './user-management.controller';

export interface createUserResponse {
  id: number;
  email: string;
  name: string;
  contactPhone: string;
  role: string;
}

// interface getUsersParams {
//   limit: number;
//   offset: number;
//   name: string;
//   email: string;
//   contactPhone: string;
// }

export interface getUsersResponse {
  id: number;
  email: string;
  name: string;
  contactPhone: string;
}

@Injectable()
export class UserManagementService {
  constructor(private readonly usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto): Promise<createUserResponse> {
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
      const newUser: UserDocument = await this.usersService.create({
        passwordHash,
        email,
        ...rest,
      });
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        contactPhone: newUser.contactPhone,
        role: newUser.role,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e;
      }
      throw new InternalServerErrorException('Пользователь не был создан');
    }
  }

  async getUsers(params: QueryParams): Promise<getUsersResponse[]> {
    try {
      const users = await this.usersService.findAll(params);
      return users.map((user) => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
        };
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e;
      }
      throw new InternalServerErrorException('Пользователи не были получены');
    }
  }
}
