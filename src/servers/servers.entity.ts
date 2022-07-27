import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectsEntity } from '../projects/projects.entity';

@Entity({ name: 'servers' })
export class ServersEntity {
  @ApiProperty({ type: Number, title: 'ID Сервера' })
  @PrimaryGeneratedColumn('increment')
  public server_id: number;

  @ApiProperty({ type: String, title: 'Название сервера' })
  @Column({ type: 'varchar', unique: true })
  public name: string;

  @ManyToOne(() => ProjectsEntity, (project: ProjectsEntity) => project.servers)
  @JoinColumn({ name: 'project_id' })
  public project: ProjectsEntity[];
}
