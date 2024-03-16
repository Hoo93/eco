import { ArgumentsHost, Catch, ConsoleLogger, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponse } from './error-reponse';

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

    const errorMessage = exception.response?.message || exception.message || 'Internal server error';

    const errorResponse = new ErrorResponse();
    errorResponse.success = false;
    errorResponse.type = exception?.name;
    errorResponse.path = httpAdapter.getRequestUrl(ctx.getRequest());
    errorResponse.timestamp = new Date().toISOString();
    errorResponse.message = errorMessage;
    errorResponse.statusCode = httpStatus;

    this.logger.error({
      message: errorResponse.message,
      exception: exception.stack,
      path: errorResponse.path,
      statusCode: httpStatus,
    });

    httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
  }
}
