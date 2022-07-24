import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoles } from 'src/users/user.roles';

export class UserProfileDto {
  @ApiProperty({ title: 'ID пользователя на сайте' })
  @Expose()
  public user_id: number;

  @ApiProperty({ title: 'Логин пользователя' })
  @Expose()
  public login: string;

  @ApiPropertyOptional({
    title: 'Аватар пользователя',
    description: 'Может не быть. В этом случае подгружать стандартный',
  })
  @Expose()
  public avatar?: string;

  @ApiProperty({
    enum: UserRoles,
    title: "Роль пользователя",
    description: `Тут пишет, что это "string", хотя на самом деле это "number"!
      USER = 0,
      MODERATOR = 800,
      ADMINISTRATOR = 900,
      OWNER = 1000
    `
  })
  @Expose()
  public role: UserRoles;

  constructor(user_profile: Omit<UserProfileDto, 'role_label'>) {
    Object.assign(this, user_profile);
  }
}
