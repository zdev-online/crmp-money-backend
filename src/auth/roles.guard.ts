import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserJwtPayload } from 'src/users/dto/user-jwt-payload';
import { UserRoles } from 'src/users/user.roles';
import { AuthJwtGuard } from './auth-jwt.guard';

export const RolesGuard = (...roles: UserRoles[]): Type<CanActivate> => {
  class RolesGuardMixin extends AuthJwtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user as UserJwtPayload;

      return roles.some((role) => role == user.role);
    }
  }

  return mixin(RolesGuardMixin);
};
