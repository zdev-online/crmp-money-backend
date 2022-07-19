import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports: [TokensModule, UsersModule, GoogleModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
