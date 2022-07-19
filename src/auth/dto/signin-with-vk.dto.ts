import { ApiProperty } from "@nestjs/swagger";

export class SignInWithVkDto {
  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public expire: number;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public mid: number;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public secret: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public sid: string;

  @ApiProperty({ title: 'Параметр от VK после авторизации' })
  public sig: string;
}