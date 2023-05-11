import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRETIK',
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
