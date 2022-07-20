import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsAlpha,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class SignInWithEmailOrLogin {
  @ApiPropertyOptional({
    type: String,
    title: 'Почта пользователя',
  })
  @ValidateIf((object, value) => !object.login)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiPropertyOptional({
    title: 'Логин пользователя',
    minLength: 4,
    maxLength: 15,
  })
  @ValidateIf((object, value) => !object.email)
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
