import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('New request');
    const now: number = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`Execution time: ${Date.now() - now}ms`);
        console.log('Request completed');
      }),
      catchError((err) => {
        console.log(`Execution time: ${Date.now() - now}ms`);
        console.log('\nRequest was failed');
        console.log(`\nError message: ${err}`);
        return err;
      }),
    );
  }
}
