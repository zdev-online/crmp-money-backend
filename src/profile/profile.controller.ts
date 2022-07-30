import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiHeader,
  ApiTags,
  ApiBearerAuth,
  PickType,
} from '@nestjs/swagger';
import { AuthJwtGuard } from 'src/auth/auth-jwt.guard';
import { ConfirmEmailDto } from 'src/profile/dto/confirm-email.dto';
import { SuccessResponseDto } from 'src/success-response.dto';
import { UserJwtPayload } from 'src/users/dto/user-jwt-payload';
import { User } from 'src/users/user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FullProfileResponseDto } from './dto/full-profile-response.dto';
import { UserProfileDto } from './dto/user-profile-response.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiOperation({
    description: 'Получить информацию о аккаунте',
  })
  @ApiOkResponse({
    type: UserProfileDto,
    description: 'Публичная информация об аккаунте',
  })
  @SerializeOptions({ strategy: 'excludeAll' })
  @Get('/:id')
  public async getUserProfile(
    @Param('id') id: number,
  ): Promise<UserProfileDto> {
    return this.profileService.getUserProfile(id);
  }

  @ApiOperation({ description: 'Получить информацию о своем аккаунте' })
  @ApiOkResponse({
    type: FullProfileResponseDto,
    description: 'Информация о аккаунте',
  })
  @ApiHeader({
    description: 'Токен доступа',
    name: 'x-access-token',
  })
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthJwtGuard)
  @Get('/')
  public async getSelfProfile(
    @User() user: UserJwtPayload,
  ): Promise<FullProfileResponseDto> {
    return this.profileService.getSelfProfile(user.user_id);
  }

  @ApiOperation({ description: 'Подтверждение E-Mail' })
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Ответ при успешном подтверждении почты',
  })
  @ApiHeader({
    description: 'Токен доступа',
    name: 'x-access-token',
  })
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthJwtGuard)
  @Post('/confirm/email')
  public async confirmEmail(
    @Query() dto: ConfirmEmailDto,
  ): Promise<SuccessResponseDto> {
    return this.profileService.confirmEmail(dto.token);
  }

  @ApiOperation({ description: 'Смена пароля пользователя' })
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Ответ при успешной смене пароля',
  })
  @ApiHeader({
    description: 'Токен доступа',
    name: 'x-access-token',
  })
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthJwtGuard)
  @Post('/password/change')
  public async changePassword(
    @User() user: UserJwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.profileService.changePassword(user.user_id, dto);
  }
}
