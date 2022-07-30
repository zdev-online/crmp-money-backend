import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleModule } from './google/google.module';
import { MailerModule } from './mailer/mailer.module';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { ProjectsModule } from './projects/projects.module';
import { ServersModule } from './servers/servers.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('production', 'development'),
        PORT: Joi.number(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        JWT_ACCESS_SECRET: Joi.string(),
        JWT_ACCESS_TTL_MS: Joi.number(),
        JWT_REFRESH_SECRET: Joi.string(),
        JWT_REFRESH_TTL_MS: Joi.number(),
        VK_APP_SECRET: Joi.string(),
        GOOGLE_RECAPTCHA_SECRET: Joi.string(),
        FRONTEND_HOST: Joi.string(),
        FRONTEND_DOMAIN: Joi.string(),
        FRONTEND_EMAIL_CONFIRM_PATH: Joi.string(),
        FRONTEND_RESTORE_PATH: Joi.string(),
        MAILER_USER: Joi.string(),
        MAILER_PASS: Joi.string(),
        MAILER_HOST: Joi.string(),
        MAILER_PORT: Joi.number(),
        MAILER_SECURE: Joi.boolean(),
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV == 'development',
        logging: process.env.NODE_ENV == 'development',
        logger: 'advanced-console',
      }),
    }),
    ScheduleModule.forRoot(),
    TokensModule,
    UsersModule,
    AuthModule,
    GoogleModule,
    MailerModule,
    ProfileModule,
    ProductsModule,
    ProjectsModule,
    ServersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
