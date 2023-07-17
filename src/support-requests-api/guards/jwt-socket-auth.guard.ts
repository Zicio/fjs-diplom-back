import { Observable } from 'rxjs';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketAuthGuard extends AuthGuard('jwt-socket') {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  public handleRequest(err: Error, user: any) {
    if (err || !user) {
      throw new WsException('Вы не авторизованы');
    }
    return user;
  }
}
