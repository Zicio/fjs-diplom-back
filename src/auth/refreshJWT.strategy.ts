import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshJWTStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['refresh_token'];
          if (!data) {
            return null;
          }
          console.log({ data });
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'supersecret',
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    const user: UserDocument | null = await this.authService.validateUser(
      payload.id,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
