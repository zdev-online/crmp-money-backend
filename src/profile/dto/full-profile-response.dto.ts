import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRoles } from 'src/users/user.roles';

export class FullProfileResponseDto {
  @ApiProperty({ title: 'ID пользователя на сайте' })
  @Expose()
  public user_id: number;

  @ApiPropertyOptional({
    title: 'E-Mail пользователя',
    description: 'Может не быть, если регистрация была через VK',
  })
  @Expose()
  public email?: string;

  @ApiProperty({ title: 'Статус подтверждения E-Mail' })
  @Expose()
  public email_confirmed: boolean;

  @ApiProperty({ title: 'Логин пользователя' })
  @Expose()
  public login: string;

  @Exclude()
  public password: string;

  @ApiPropertyOptional({
    title: 'VK ID пользователя',
    description: 'Может не быть, если регистрация через почту',
  })
  @Transform(({ value }) => {
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
  })
  @Expose()
  public vk_id?: number;

  @ApiPropertyOptional({
    title: 'Аватар пользователя',
    description: 'Может не быть. В этом случае подгружать стандартный',
  })
  @Expose()
  public avatar?: string;

  @ApiProperty({
    enum: UserRoles,
    title: 'Роль пользователя',
    description: `
      Тут пишет, что это \`string\`, хотя на самом деле это ЧИСЛО!!!
        USER = 0,
        MODERATOR = 800,
        ADMINISTRATOR = 900,
        OWNER = 1000,
      `,
  })
  @Expose()
  public role: UserRoles;

  @ApiProperty({ title: 'Дата регистрации' })
  @Expose()
  public created_at: Date;

  @Exclude()
  public updated_at: Date;

  constructor(profile: FullProfileResponseDto) {
    Object.assign(this, profile);
  }
}
