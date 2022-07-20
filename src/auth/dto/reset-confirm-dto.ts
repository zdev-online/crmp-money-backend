import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class ResetConfirmDto {
  @ApiProperty({
    title: 'Токен из параметров адреса',
  })
  @IsNotEmpty()
  @IsString()
  public reset_token: string;

  @ApiProperty({
    title: 'Новый пароль пользователя',
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  public new_password: string;
}