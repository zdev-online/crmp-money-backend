import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    title: 'Токен потдтверждения почты почты',
    description: 'Его нужно взять из search-параметров ссылки (?token=*)',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
