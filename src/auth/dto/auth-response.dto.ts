import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    title: 'Токен доступа',
    description: 'Используется для запросов к защищенным эндпоинтам',
  })
  public access_token: string;

  @ApiProperty({
    title: 'Токен обновления | завершения сессии',
    description: 'Используется для обновления пары токенов',
  })
  public refresh_token: string;

  @ApiProperty({ title: 'Публичные данные пользователя' })
  @Type(() => UserResponseDto)
  public user: UserResponseDto;

  constructor(response: AuthResponseDto) {
    Object.assign(this, response);
  }
}
