import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (socket: Socket) => {
        return socket.handshake.headers.authorization;
      },
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
