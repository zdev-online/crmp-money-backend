import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsAlpha,
  IsNumber,
} from 'class-validator';

export class SignUpWithVkDto {
  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  @IsNotEmpty()
  @IsNumber()
  public expire: number;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  @IsNotEmpty()
  @IsString()
  public mid: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  @IsNotEmpty()
  @IsString()
  public secret: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  @IsNotEmpty()
  @IsString()
  public sid: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  @IsNotEmpty()
  @IsString()
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
