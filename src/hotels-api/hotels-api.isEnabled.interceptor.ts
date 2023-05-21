import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HotelsApiIsEnabledInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isClient = user && user.role === 'client';
    if (!user || isClient) {
      request.isEnabled = true;
    }
    return next.handle();
  }
}
