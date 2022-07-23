import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    title: 'Старый пароль пользователя',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  old_password: string;

  @ApiProperty({
    title: 'Новый пароль пользователя',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  new_password: string;
}
