import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServersEntity } from './servers.entity';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(ServersEntity)
    private serversEntity: Repository<ServersEntity>
  ) { }

  public async findById(server_id: number): Promise<ServersEntity> {
    return this.serversEntity.findOneBy({ server_id });
  }
}
