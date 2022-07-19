import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInWithEmailOrLogin } from './dto/signin-with-email-or-login.dto';
import { SignInWithVkDto } from './dto/signin-with-vk.dto';
import { SignUpWithEmailDto } from './dto/signup-with-email.dto';
import { SignUpWithVkDto } from './dto/signup-with-vk.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiTags('Authorization')
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной регистрации через E-Mail',
  })
  @Post('/signup/email')
  public async signupWithEmail(
    @Body() dto: SignUpWithEmailDto,
  ): Promise<AuthResponseDto> {
    return this.authService.signupWithEmail(dto);
  }

  @ApiTags('Authorization')
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной регистрации через VK',
  })
  @Post('/signup/vk')
  public async signupWithVK(@Body() dto: SignUpWithVkDto): Promise<AuthResponseDto> {
    return this.authService.signupWithVK(dto);
  }

  @ApiTags('Authorization')
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной авторизации через E-Mail или логин',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  public async signinWithEmailOrLogin(@Body() dto: SignInWithEmailOrLogin): Promise<AuthResponseDto> {
    return this.authService.signinWithEmailOrLogin(dto);
  }

  @ApiTags('Authorization')
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешной авторизации через VK',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/signin/vk')
  public async signinWithVk(@Body() dto: SignInWithVkDto): Promise<AuthResponseDto> {
    return this.authService.signinWithVK(dto);
  }

  @ApiTags('Authorization')
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Ответ при успешном обновлении токенов',
  })
  @ApiHeader({ name: 'x-refresh-token', description: "Токен обновления | завершения сессии" })
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  public async refresh(@Headers('x-refresh-token') current_refresh_token: string): Promise<AuthResponseDto> {
    return this.authService.refresh(current_refresh_token);
  }

  @ApiTags('Authorization')
  @ApiOkResponse({
    description: 'Ответ при успешном завершении сессии',
  })
  @ApiHeader({ name: 'x-refresh-token', description: "Токен обновления | завершения сессии" })
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  public async logout(@Headers('x-refresh-token') refresh_token: string): Promise<void> {
    return this.authService.logout(refresh_token);
  }
}
