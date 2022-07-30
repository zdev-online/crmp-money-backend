import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignInWithVkDto {
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
}
