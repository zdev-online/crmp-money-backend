import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserProfileDto {
  @ApiProperty({ title: "ID пользователя на сайте" })
  @Expose()
  public user_id: number;

  @ApiProperty({ title: "Логин пользователя" })
  @Expose()
  public login: string;

  constructor(user_profile: UserProfileDto) {
    Object.assign(this, user_profile);
  }
}