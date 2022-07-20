import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ResetStartDto {
  @ApiProperty({
    type: String,
    title: 'Почта пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;
}
