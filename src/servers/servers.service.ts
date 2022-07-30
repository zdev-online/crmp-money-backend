import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsEntity } from 'src/projects/projects.entity';
import { Repository } from 'typeorm';
import { ServersEntity } from './servers.entity';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(ServersEntity)
    private serversEntity: Repository<ServersEntity>
  ) { }

  public async findAll(): Promise<ServersEntity[]> {
    return this.serversEntity
      .createQueryBuilder('server')
      .innerJoinAndMapOne('server.project', ProjectsEntity, 'project', 'server.project_id = project.project_id')
      .getMany();
  }

  public async findById(server_id: number): Promise<ServersEntity> {
    return this.serversEntity.findOne({ relations: { project: true }, where: { server_id } });
  }
}
