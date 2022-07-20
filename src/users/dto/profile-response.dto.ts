import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import { UsersEntity } from '../users.entity';

export class ProfileResponseDto implements UsersEntity {
  @ApiProperty({
    title: 'ID пользователя',
  })
  @Expose()
  public user_id: number;

  @ApiPropertyOptional({
    type: String,
    title: 'Почта пользователя',
  })
  @Expose()
  public email?: string;

  @ApiProperty({
    type: Boolean,
    title: 'Подтверждена ли почта или нет',
  })
  @Expose()
  public email_confirmed: boolean;

  @ApiProperty({
    type: String,
    title: 'Логин пользователя',
  })
  @Expose()
  public login: string;

  @Exclude()
  public password: string;

  @ApiPropertyOptional({
    type: Number,
    title: 'ID профиля VK пользователя',
  })
  @Expose()
  public vk_id?: number;

  @ApiProperty({
    type: Date,
    title: 'Дата регистрации профиля',
  })
  @Expose()
  public created_at: Date;

  @ApiProperty({
    type: Date,
    title: 'Дата последнего обновления профиля',
  })
  @Expose()
  public updated_at: Date;

  constructor(profile: ProfileResponseDto) {
    Object.assign(this, profile);
  }
}
