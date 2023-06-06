import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Role, ROLES_KEY } from './roles.decorator';

@Injectable()
export class isEnabledGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: Error, user: any, info: any, context: any) {
    const request = context.switchToHttp().getRequest();

    // Устанавливаем user в объекте запроса
    request.user = user;

    // Проверяем роль пользователя и устанавливаем isEnabled в true, если необходимо
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!user || requiredRole.includes(user.role)) {
      request.isEnabled = true;
    }
    return user;
  }
}
