import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/auth/auth-jwt.guard';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { UserJwtPayload } from './dto/user-jwt-payload';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiHeader({
  description: 'Токен доступа',
  name: 'x-access-token',
})
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @ApiOperation({ description: "Получить чужой профиль" })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Ответ при запросе пользователя по ID',
  })
  @Get('/profile/:id')
  public async getProfileById(
    @Param('id') user_id: number,
  ): Promise<UserResponseDto> {
    return await this.userService.getUserProfileById(user_id);
  }

  @ApiOperation({ description: "Получить свой профиль" })
  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'Ответ при запросе своих данных',
  })
  @UseGuards(AuthJwtGuard)
  @Get('/profile')
  public async getProfile(
    @User() user: UserJwtPayload,
  ): Promise<ProfileResponseDto> {
    return await this.userService.getProfile(user.user_id);
  }

  @ApiOperation({ description: "Подтверждение E-Mail" })
  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'Ответ при успешном подтверждении почты',
  })
  @UseGuards(AuthJwtGuard)
  @Post('/profile/confirm/email')
  public async confirmEmail(@Query() dto: ConfirmEmailDto): Promise<void> {
    return this.userService.confirmEmail(dto.token);
  }
}
