import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJwtPayload } from './dto/user-jwt-payload';

export const User = createParamDecorator(
  (data: keyof UserJwtPayload, ctx: ExecutionContext) => {
    if (ctx.getType() == 'http') {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    }

    return null;
  },
);
