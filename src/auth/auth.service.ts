import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import { md5 } from 'src/utils';
import { SignUpWithEmailDto } from './dto/signup-with-email.dto';
import { SignUpWithVkDto } from './dto/signup-with-vk.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserJwtPayload } from 'src/users/dto/user-jwt-payload';
import { GoogleService } from 'src/google/google.service';
import { RefreshTokenPayloadDto } from 'src/tokens/dto/refresh-token-payload.dto';
import { SignInWithVkDto } from './dto/signin-with-vk.dto';
import { SignInWithEmailOrLogin } from './dto/signin-with-email-or-login.dto';
import { ResetStartDto } from './dto/reset.dto';
import { ResetConfirmDto } from './dto/reset-confirm-dto';
import { MailerService } from 'src/mailer/mailer.service';
import { SuccessResponseDto } from 'src/success-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private tokenService: TokensService,
    private userService: UsersService,
    private googleService: GoogleService,
    private mailerService: MailerService,
  ) {}

  public async signupWithEmail(
    dto: SignUpWithEmailDto,
  ): Promise<AuthResponseDto> {
    // await this.googleService.verifyCaptchaOrThrow(dto.recaptcha_token);

    const duplicate = await this.userService.checkDuplicateCredentials({
      email: dto.email,
      login: dto.login,
    });

    if (duplicate) {
      throw new BadRequestException(duplicate);
    }

    const password = await this.userService.hashPassword(dto.password);
    const new_user = await this.userService.create({ ...dto, password });

    const uuid = uuidv4();
    const [access_token, refresh_token] = await this.generateTokens(
      {
        uuid,
        user_id: new_user.user_id,
      },
      {
        user_id: new_user.user_id,
        role: new_user.role,
      },
    );
    const [, activation_token] = await Promise.all([
      this.tokenService.saveRefreshToken(refresh_token, uuid, new_user.user_id),
      this.tokenService.generateActivationToken(new_user.user_id),
    ]);

    this.mailerService.sendActivationLink({
      email: dto.email,
      token: activation_token,
    });

    return new AuthResponseDto({ access_token, refresh_token, user: new_user });
  }

  public async signupWithVK(dto: SignUpWithVkDto): Promise<AuthResponseDto> {
    // await this.googleService.verifyCaptchaOrThrow(dto.recaptcha_token);
    const isValidVKAuthData = this.isValidVKAuthData(dto);
    if (!isValidVKAuthData) {
      throw new BadRequestException({
        message: 'Неверные параметры авторизации',
      });
    }

    const dublicate = await this.userService.checkDuplicateCredentials({
      vk_id: Number(dto.mid),
      login: dto.login,
    });

    if (dublicate) {
      throw new BadRequestException(dublicate);
    }

    const password = await this.userService.hashPassword(
      `${Math.floor(Date.now() / 1000) * Math.random()}_DEFAULT_PASS`,
    );
    const new_user = await this.userService.create({ vk_id: Number(dto.mid), password, login: dto.login });

    const uuid = uuidv4();
    const [access_token, refresh_token] = await this.generateTokens(
      {
        uuid,
        user_id: new_user.user_id,
      },
      {
        user_id: new_user.user_id,
        role: new_user.role,
      },
    );
    await this.tokenService.saveRefreshToken(
      refresh_token,
      uuid,
      new_user.user_id,
    );

    return new AuthResponseDto({ access_token, refresh_token, user: new_user });
  }

  public async signinWithEmailOrLogin(
    dto: SignInWithEmailOrLogin,
  ): Promise<AuthResponseDto> {
    await this.googleService.verifyCaptchaOrThrow(dto.recaptcha_token);

    const user = await this.userService.findByEmailOrLogin(
      dto.email,
      dto.login,
    );
    if (!user) {
      throw new NotFoundException({ message: 'Пользователь не найден' });
    }

    const isValidPassword = await this.userService.isValidPassword(
      dto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException({ message: 'Неверный пароль!' });
    }

    const uuid = uuidv4();
    const [access_token, refresh_token] = await this.generateTokens(
      {
        uuid,
        user_id: user.user_id,
      },
      {
        user_id: user.user_id,
        role: user.role,
      },
    );
    await this.tokenService.saveRefreshToken(refresh_token, uuid, user.user_id);

    return new AuthResponseDto({ access_token, refresh_token, user });
  }

  public async signinWithVK(dto: SignInWithVkDto): Promise<AuthResponseDto> {
    const isValidVKAuthData = this.isValidVKAuthData(dto);
    if (!isValidVKAuthData) {
      throw new BadRequestException({
        message: 'Неверные параметры авторизации',
      });
    }

    const user = await this.userService.findByVkId(Number(dto.mid));
    if (!user) {
      throw new NotFoundException({ message: 'Пользователь не найден' });
    }

    const uuid = uuidv4();
    const [access_token, refresh_token] = await this.generateTokens(
      {
        uuid,
        user_id: user.user_id,
      },
      {
        user_id: user.user_id,
        role: user.role,
      },
    );
    await this.tokenService.saveRefreshToken(refresh_token, uuid, user.user_id);

    return new AuthResponseDto({ access_token, refresh_token, user });
  }

  public async logout(refresh_token: string): Promise<SuccessResponseDto> {
    const decoded_data = await this.tokenService.verifyRefreshToken(
      refresh_token,
    );
    if (!decoded_data) {
      throw new UnauthorizedException({
        message: 'Авторизируйтесь для данного действия',
      });
    }
    await this.tokenService.deleteTokenByUuid(decoded_data.uuid);
    return new SuccessResponseDto('Успешный выход из системы');
  }

  public async refresh(
    current_refresh_token: string,
  ): Promise<AuthResponseDto> {
    const decoded_data = await this.tokenService.verifyRefreshToken(
      current_refresh_token,
    );
    if (!decoded_data) {
      throw new UnauthorizedException({
        message: 'Авторизируйтесь для данного действия',
      });
    }

    const [token_data, user] = await Promise.all([
      this.tokenService.findByUuid(decoded_data.uuid),
      this.userService.findByUserId(decoded_data.user_id),
    ]);
    if (!user || !token_data) {
      throw new UnauthorizedException({
        message: 'Авторизируйтесь для данного действия',
      });
    }

    await this.tokenService.deleteTokenByUuid(token_data.uuid);

    const uuid = uuidv4();
    const [access_token, refresh_token] = await this.generateTokens(
      { user_id: user.user_id, uuid },
      {
        user_id: user.user_id,
        role: user.role,
      },
    );

    await this.tokenService.saveRefreshToken(refresh_token, uuid, user.user_id);

    return new AuthResponseDto({ access_token, refresh_token, user });
  }

  public async restoreStart(dto: ResetStartDto): Promise<ResetStartDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException({ message: 'Пользователь не найден' });
    }

    const reset_token = await this.tokenService.generateResetToken(
      user.user_id,
    );

    this.mailerService.sendRestoreLink({
      email: dto.email,
      token: reset_token,
    });

    return dto;
  }

  public async restoreConfirm(
    dto: ResetConfirmDto,
  ): Promise<SuccessResponseDto> {
    const decoded_reset_token = await this.tokenService.verifyAccessToken<{
      user_id: number;
    }>(dto.reset_token);

    if (!decoded_reset_token) {
      throw new BadRequestException({
        message: 'Аккаунт не запрашивал восстановление',
      });
    }

    const password = await this.userService.hashPassword(dto.new_password);

    await Promise.all([
      this.userService.update(decoded_reset_token.user_id, { password }),
      this.tokenService.deleteTokensByUserId(decoded_reset_token.user_id),
    ]);

    return new SuccessResponseDto('Пароль изменен');
  }

  private generateTokens(
    refresh_token_payload: RefreshTokenPayloadDto,
    access_token_payload: UserJwtPayload,
  ): Promise<[string, string]> {
    return Promise.all([
      this.tokenService.generateAccessToken(access_token_payload),
      this.tokenService.generateRefreshToken(refresh_token_payload),
    ]);
  }

  private isValidVKAuthData(
    auth_data: Pick<
      SignUpWithVkDto,
      'expire' | 'mid' | 'secret' | 'sid' | 'sig'
    >,
  ): boolean {
    const { expire, mid, secret, sid, sig } = auth_data;
    const app_secret = this.configService.get('VK_APP_SECRET');
    return (
      md5(`expire=${expire}mid=${mid}secret=${secret}sid=${sid}${app_secret}`) ==
      sig
    );
  }
}
