import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddServerDto } from '../../servers/dto/add-server.dto';

export class AddProjectDto {

  @ApiProperty({ type: String, title: 'Название Проекта' })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({ type: [AddServerDto], title: 'Сервера проекта' })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AddServerDto)
  public servers: AddServerDto[];
}
