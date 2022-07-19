import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    type: String,
    title: 'Почта пользователя',
    description: 'Не обязательна, если регистрация через VK',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email?: string;

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

  @ApiPropertyOptional({
    type: Number,
    title: 'ID профиля VK пользователя',
    description: 'Не обязателен, если регистрация через почту',
  })
  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  public vk_id?: number;
}
