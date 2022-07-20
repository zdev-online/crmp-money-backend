import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import e from 'express';
import { Cookies } from 'src/cookies.decorator';
import { TokensService } from 'src/tokens/tokens.service';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ResetConfirmDto } from './dto/reset-confirm-dto';
import { ResetStartDto } from './dto/reset.dto';
import { SignInWithEmailOrLogin } from './dto/signin-with-email-or-login.dto';
import { SignInWithVkDto } from './dto/signin-with-vk.dto';
import { SignUpWithEmailDto } from './dto/signup-with-email.dto';
import { SignUpWithVkDto } from './dto/signup-with-vk.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokensService,
  ) {}

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Регистрация через E-Mail' })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной регистрации через E-Mail',
  })
  @Post('/signup/email')
  public async signupWithEmail(
    @Body() dto: SignUpWithEmailDto,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<AuthResponseDto> {
    const auth_response = await this.authService.signupWithEmail(dto);

    this.setRefreshTokenCookie(auth_response.refresh_token, res);

    return auth_response;
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Регистрация через VK' })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной регистрации через VK',
  })
  @Post('/signup/vk')
  public async signupWithVK(
    @Body() dto: SignUpWithVkDto,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<AuthResponseDto> {
    const auth_response = await this.authService.signupWithVK(dto);

    this.setRefreshTokenCookie(auth_response.refresh_token, res);

    return auth_response;
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Авторизация через логин или E-Mail' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной авторизации через E-Mail или логин',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  public async signinWithEmailOrLogin(
    @Body() dto: SignInWithEmailOrLogin,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<AuthResponseDto> {
    const auth_response = await this.authService.signinWithEmailOrLogin(dto);

    this.setRefreshTokenCookie(auth_response.refresh_token, res);

    return auth_response;
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Авторизация через VK' })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной авторизации через VK',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signin/vk')
  public async signinWithVk(
    @Body() dto: SignInWithVkDto,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<AuthResponseDto> {
    const auth_response = await this.authService.signinWithVK(dto);

    this.setRefreshTokenCookie(auth_response.refresh_token, res);

    return auth_response;
  }

  @ApiTags('Authorization')
  @ApiOperation({
    description:
      'Обновление пары токенов и получение информации о пользователе',
  })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешном обновлении токенов',
  })
  @ApiCookieAuth('x-refresh-token')
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  public async refresh(
    @Cookies('x-refresh-token') current_refresh_token: string,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<AuthResponseDto> {
    const refresh_data = await this.authService.refresh(current_refresh_token);

    this.setRefreshTokenCookie(refresh_data.refresh_token, res);

    return refresh_data;
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Завершение сессии по refresh-токену' })
  @ApiOkResponse({
    description: 'Ответ при успешном завершении сессии',
  })
  @ApiCookieAuth('x-refresh-token')
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  public async logout(
    @Cookies('x-refresh-token') refresh_token: string,
    @Res({ passthrough: true }) res: e.Response,
  ): Promise<void> {
    console.log(refresh_token);

    res.clearCookie('x-refresh-token', {
      httpOnly: true,
      path: '/auth',
    });

    return this.authService.logout(refresh_token);
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Начать восстановление доступа' })
  @ApiOkResponse({
    description: 'Ответ при успешном начале восстановления',
    type: ResetStartDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/restore/start')
  public async restoreStart(
    @Body() dto: ResetStartDto,
  ): Promise<ResetStartDto> {
    return this.authService.restoreStart(dto);
  }

  @ApiTags('Authorization')
  @ApiOperation({ description: 'Завершение восстановления доступа' })
  @ApiOkResponse({
    description: 'Ответ при успешной смене пароля',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/restore/confirm')
  public async restoreConfrim(@Body() dto: ResetConfirmDto): Promise<void> {
    return this.authService.restoreConfirm(dto);
  }

  private setRefreshTokenCookie(refresh_token: string, res: e.Response): void {
    res.cookie('x-refresh-token', refresh_token, {
      httpOnly: true,
      maxAge: this.tokenService.getRefreshTokensExpireTime(),
      path: '/auth',
    });
  }
}
