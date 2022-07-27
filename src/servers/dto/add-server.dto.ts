import { IsNotEmpty, IsString } from 'class-validator';

export class AddServerDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
