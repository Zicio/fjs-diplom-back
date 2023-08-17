import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
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
    console.log({ id });
    const user: UserDocument | null = await this.usersService.findById(id);
    if (user) {
      return user;
    }
    return null;
  }

  async returnTokens(
    user: UserDocument,
    accessToken: string,
    refreshToken: string,
    res: Response,
  ): Promise<LoginResponseDto> {
    await this.updateRefreshToken(user.id, refreshToken);
    res.cookie('refresh_token', refreshToken, {
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
      accessToken,
    } as LoginResponseDto);
    return { email, name, contactPhone, accessToken };
  }

  async refreshToken(
    user: UserDocument,
    refreshToken: string,
    res: Response,
  ): Promise<LoginResponseDto> {
    try {
      console.log({ refreshToken });
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException();
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await this.getTokens(user);
      return this.returnTokens(user, accessToken, newRefreshToken, res);
    } catch (e) {
      throw e;
    }
  }

  async getTokens(
    user: UserDocument,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, email, name, role } = user;
    const payload = {
      id,
      email,
      name,
      role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'secret',
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES) || 1800,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'supersecret',
        expiresIn: Number(process.env.JWT_REFRESH_EXPIRES) || 1800,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: ID,
    refreshToken: string,
  ): Promise<UserDocument | null> {
    return this.usersService.update(userId, { refreshToken });
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
      const { accessToken, refreshToken } = await this.getTokens(user);
      return this.returnTokens(user, accessToken, refreshToken, res);
    } catch (e) {
      throw e;
    }
  }

  async logout(
    res: Response,
    req: Request & { user: UserDocument },
  ): Promise<void> {
    await this.usersService.update(req.user.id, { refreshToken: null });
    res.clearCookie('refresh_token');
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
