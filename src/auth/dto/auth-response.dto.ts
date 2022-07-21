import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ProfileResponseDto } from 'src/users/dto/profile-response.dto';

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

  @ApiProperty({ title: 'Данные пользователя' })
  @Type(() => ProfileResponseDto)
  public user: ProfileResponseDto;

  constructor(response: AuthResponseDto) {
    Object.assign(this, response);
  }
}
