import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import e from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { UserJwtPayload } from 'src/users/dto/user-jwt-payload';

export class AuthJwtGuard implements CanActivate {
  constructor(@Inject(TokensService) private tokenService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() == 'http') {
      const request = context.switchToHttp().getRequest() as e.Request & {
        user: UserJwtPayload;
      };

      const access_token = request.header('x-access-token') || '';

      const decoded_data =
        await this.tokenService.verifyAccessToken<UserJwtPayload>(access_token);
      if (!decoded_data) {
        throw new UnauthorizedException({
          message: 'Авторизируйтесь для данного действия',
        });
      }

      request.user = decoded_data;

      return true;
    }

    return true;
  }
}
