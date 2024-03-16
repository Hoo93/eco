import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
});
