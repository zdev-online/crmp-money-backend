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
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @Type(() => AddServerDto)
  public servers: AddServerDto[];
}
