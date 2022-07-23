import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleModule } from 'src/google/google.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [TokensModule, UsersModule, GoogleModule, MailerModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
