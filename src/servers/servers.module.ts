import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersEntity } from './servers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServersEntity])],
  providers: [ServersService],
  controllers: [ServersController]
})
export class ServersModule { }
