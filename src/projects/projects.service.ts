import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddProjectDto } from './dto/add-project.dto';
import { ProjectsEntity } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private projectsRepository: Repository<ProjectsEntity>,
  ) { }

  public async findAll(): Promise<ProjectsEntity[]> {
    const projects = await this.projectsRepository.find();
    return projects || [];
  }

  public async findById(project_id: number): Promise<ProjectsEntity | null> {
    const project = await this.projectsRepository.findOneBy({ project_id });
    return project || null;
  }

  public async findByName(name: string): Promise<ProjectsEntity> {
    return this.projectsRepository.findOneBy({ name });
  }

  public async create(dto: AddProjectDto): Promise<ProjectsEntity> {
    return this.projectsRepository.save(dto);
  }
}
