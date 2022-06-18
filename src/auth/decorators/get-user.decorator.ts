import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) {
    throw new UnauthorizedException();
  }
  return {
    ...request.user,
    hashedPassword: 'secure',
    hashedRefreshToken: 'secure',
  };
});
