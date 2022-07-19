import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './tokens.entity';
import { TokensService } from './tokens.service';

@Global()
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([TokensEntity])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
