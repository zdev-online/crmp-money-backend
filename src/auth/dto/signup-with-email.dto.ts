import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsAlpha,
} from 'class-validator';

export class SignUpWithEmailDto {
  @ApiProperty({
    type: String,
    title: 'Почта пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

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

  @ApiProperty({
    title: 'Пароль пользователя',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  public password: string;

  @ApiProperty({
    title: 'Токен reCaptcha V3 Google',
    minLength: 4,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  public recaptcha_token: string;
}
