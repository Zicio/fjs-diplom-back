import { Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSocketAuthGuard extends AuthGuard('jwt-socket') {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  public handleRequest(err: Error, user: any) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException('Вы не авторизованы');
    }
    return user;
  }
}
