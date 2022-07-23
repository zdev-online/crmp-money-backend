import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { SelfProfileResponseDto } from 'src/profile/dto/self-profile-response.dto';

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
  @Type(() => SelfProfileResponseDto)
  public user: SelfProfileResponseDto;

  constructor(response: AuthResponseDto) {
    Object.assign(this, response);
  }
}
