import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalDateTime } from '@js-joda/core';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data?.success) {
          return {
            success: true,
            timestamp: LocalDateTime.now().toString(),
            data,
          };
        }
        return data;
      }),
    );
  }
}
