import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectsEntity } from './projects.entity';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @ApiOperation({ description: 'Получение проектов' })
  @ApiOkResponse({ type: [ProjectsEntity] })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  public async findAll(): Promise<ProjectsEntity[]> {
    return this.projectsService.findAll();
  }

  @ApiOperation({ description: 'Получение проекта по ID' })
  @ApiOkResponse({ type: ProjectsEntity })
  @HttpCode(HttpStatus.OK)
  @Get('/:project_id')
  public async findById(
    @Param('project_id') project_id: number,
  ): Promise<ProjectsEntity> {
    return this.projectsService.findById(project_id);
  }
}
