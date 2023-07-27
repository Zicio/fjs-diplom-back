import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { RegistrationDto } from './dto/registration.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ID } from '../globalType';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: ID): Promise<UserDocument | null> {
    const user: UserDocument | null = await this.usersService.findById(id);
    if (user) {
      return user;
    }
    return null;
  }

  async createToken(user: UserDocument): Promise<string> {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload, {
      expiresIn: Number(process.env.JWT_EXPIRES) || 60 * 60 * 1000,
      secret: process.env.JWT_SECRET || 'secret',
    });
  }

  async login(loginDto: LoginDto, res: Response): Promise<LoginResponseDto> {
    try {
      const user: UserDocument | null = await this.usersService.findByEmail(
        loginDto.email,
      );
      if (!user) {
        throw new UnauthorizedException('Неверный логин/пароль');
      }
      const isValidPassword: boolean = await bcrypt.compare(
        loginDto.password,
        user.passwordHash,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Неверный логин/пароль');
      }
      const token: string = await this.createToken(user);
      res.cookie('access_token', token, {
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        maxAge: Number(process.env.COOKIE_EXPIRES) || 45 * 60 * 1000,
      });
      const { email, name, contactPhone } = user;
      res.status(200).json({
        email,
        name,
        contactPhone,
      } as LoginResponseDto);
      return { email, name, contactPhone };
    } catch (e) {
      throw e;
    }
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie('access_token');
    res.status(204).end();
  }

  async register(
    registrationDto: RegistrationDto,
  ): Promise<RegistrationResponseDto> {
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
    } catch (e) {
      throw e;
    }
  }
}
