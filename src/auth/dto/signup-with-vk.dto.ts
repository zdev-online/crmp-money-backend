import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsAlpha,
} from 'class-validator';

export class SignUpWithVkDto {
  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public expire: number;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public mid: number;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public secret: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public sid: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public sig: string;

  @ApiProperty({
    title: 'Логин пользователя',
    minLength: 4,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(4)
  @MaxLength(15)
  public login: string;

  // @ApiProperty({
  //   title: 'Токен reCaptcha V3 Google',
  //   minLength: 4,
  //   maxLength: 15,
  // })
  // @IsNotEmpty()
  // @IsString()
  // public recaptcha_token: string;
}
