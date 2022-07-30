import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FullProfileResponseDto } from 'src/profile/dto/full-profile-response.dto';

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

  @ApiProperty({ title: 'Данные пользователя', type: FullProfileResponseDto })
  @Type(() => FullProfileResponseDto)
  public user: FullProfileResponseDto;

  constructor(response: AuthResponseDto) {
    Object.assign(this, response);
  }
}
