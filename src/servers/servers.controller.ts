import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServersEntity } from './servers.entity';
import { ServersService } from './servers.service';

@ApiTags("Servers")
@Controller('servers')
export class ServersController {
  constructor(
    private serversService: ServersService
  ) { }

  @ApiOperation({ description: "Получить сервер по ID" })
  @ApiOkResponse({ type: ServersEntity })
  @Get("/:server_id")
  public async findById(@Param('server_id') server_id: number): Promise<ServersEntity> {
    return this.serversService.findById(server_id);
  }
}
