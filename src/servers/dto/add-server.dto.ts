import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddServerDto {
  @ApiProperty({ type: String, title: 'Название сервера' })
  @IsNotEmpty()
  @IsString()
  public name: string;
}
