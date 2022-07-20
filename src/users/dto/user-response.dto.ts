import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UsersEntity } from '../users.entity';

export class UserResponseDto implements UsersEntity {
  @ApiProperty({
    title: "ID пользователя"
  })
  @Expose()
  public user_id: number;

  // @ApiPropertyOptional({
  //   type: String,
  //   title: 'Почта пользователя',
  // })
  @Exclude()
  public email?: string;

  // @ApiProperty({
  //   type: Boolean,
  //   title: 'Подтверждена ли почта или нет',
  // })
  @Exclude()
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

  // @ApiProperty({
  //   type: Date,
  //   title: 'Дата регистрации профиля',
  // })
  @Exclude()
  public created_at: Date;

  // @ApiProperty({
  //   type: Date,
  //   title: 'Дата последнего обновления профиля',
  // })
  @Exclude()
  public updated_at: Date;

  constructor(response: UserResponseDto) {
    Object.assign(this, response);
  }
}
