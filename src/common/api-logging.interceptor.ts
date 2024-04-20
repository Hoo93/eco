// src/common/interceptors/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.NODE_ENV !== 'production') {
      const req = context.switchToHttp().getRequest();
      const method = req.method;
      const url = req.url;

      const now = Date.now();
      return next.handle().pipe(
        tap(() => {
          const ms = Date.now() - now;
          this.logger.debug(`${method} ${url} has been executed in ${ms}ms`);
        }),
      );
    }

    return next.handle();
  }
}
