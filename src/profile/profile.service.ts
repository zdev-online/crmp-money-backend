import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SuccessResponseDto } from 'src/success-response.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SelfProfileResponseDto } from './dto/self-profile-response.dto';
import { UserProfileDto } from './dto/user-profile-response.dto';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UsersService,
    private tokenService: TokensService,
  ) {}

  public async getUserProfile(user_id: number): Promise<UserProfileDto> {
    const user_profile = await this.userService.findByUserId(user_id);
    if (!user_profile) {
      throw new NotFoundException({ message: 'Пользователь не найден' });
    }

    return new UserProfileDto(user_profile);
  }

  public async getSelfProfile(
    user_id: number,
  ): Promise<SelfProfileResponseDto> {
    const profile = await this.userService.findByUserId(user_id);

    return new SelfProfileResponseDto(profile);
  }

  public async confirmEmail(token: string): Promise<SuccessResponseDto> {
    const decoded_activation_token = await this.tokenService.verifyAccessToken<{
      user_id: number;
    }>(token);
    if (!decoded_activation_token) {
      throw new BadRequestException({
        message: 'Неверный токен активации почты',
      });
    }

    await this.userService.update(decoded_activation_token.user_id, {
      email_confirmed: true,
    });

    return new SuccessResponseDto('Почта подтверждена');
  }

  public async changePassword(
    user_id: number,
    dto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    const user = await this.userService.findByUserId(user_id);
    const isValidPassword = await this.userService.isValidPassword(
      dto.old_password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException({ message: 'Неверный пароль' });
    }

    const password = await this.userService.hashPassword(dto.new_password);

    await this.userService.update(user_id, { password });

    return new SuccessResponseDto('Успешная смена пароля');
  }
}
