import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ description: 'Сообщение для пользователя' })
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
