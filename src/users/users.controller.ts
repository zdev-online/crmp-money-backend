import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/auth/auth-jwt.guard';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UserJwtPayload } from './dto/user-jwt-payload';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Ответ при запросе пользователя по ID',
  })
  @ApiHeader({
    description: 'Токен доступа',
    name: 'x-access-token',
  })
  @Get('/profile/:id')
  public async getProfileById(
    @Param('id') user_id: number,
  ): Promise<UserResponseDto> {
    return await this.userService.getUserProfileById(user_id);
  }

  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'Ответ при запросе своих данных',
  })
  @ApiHeader({
    description: 'Токен доступа',
    name: 'x-access-token',
  })
  @UseGuards(AuthJwtGuard)
  @Get('/profile')
  public async getProfile(
    @User() user: UserJwtPayload,
  ): Promise<ProfileResponseDto> {
    return await this.userService.getProfile(user.user_id);
  }
}
