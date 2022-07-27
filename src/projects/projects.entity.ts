import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServersEntity } from '../servers/servers.entity';

@Entity({ name: 'projects' })
export class ProjectsEntity {
  @ApiProperty({ type: Number, title: 'ID Проекта' })
  @PrimaryGeneratedColumn('increment')
  public project_id: number;

  @ApiProperty({ type: String, title: 'Назвние Проекта' })
  @Column({ type: 'varchar', unique: true })
  public name: string;

  @ApiProperty({ type: [ServersEntity], title: 'Сервера проекта' })
  @OneToMany(() => ServersEntity, (server: ServersEntity) => server.project, {
    cascade: true,
    eager: true,
  })
  public servers: ServersEntity[];
}
