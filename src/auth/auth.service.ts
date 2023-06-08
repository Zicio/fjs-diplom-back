import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: Types.ObjectId): Promise<UserDocument | null> {
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

  async login(loginDto: LoginDto, res: Response): Promise<void> {
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
        maxAge: Number(process.env.COOKIE_EXPIRES) || 45 * 60 * 1000,
      });
      res.status(200).json({
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      });
    } catch (e: unknown) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException('Вход не выполнен');
    }
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie('access_token');
    res.status(204).end();
  }
}
