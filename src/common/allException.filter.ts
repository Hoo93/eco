import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorReponse } from './error-reponse';
import * as http from 'http';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: ConsoleLogger,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = new ErrorReponse();
    errorResponse.type = exception?.name;
    errorResponse.path = httpAdapter.getRequestUrl(ctx.getRequest());
    errorResponse.timestamp = new Date().toLocaleString();
    errorResponse.message = typeof exception === 'string' ? exception : exception.response?.message;
    errorResponse.statusCode = exception.status;

    this.logger.error(errorResponse.message, exception.stack, errorResponse.path);

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
