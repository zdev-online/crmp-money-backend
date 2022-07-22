import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: Number(configService.get('MAILER_PORT')),
          secure: configService.get('MAILER_SECURE') == 'true',
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASS')
          }
        },
        template: {
          dir: 'templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        defaults: {
          from: `"crmp-money" <${configService.get("MAILER_USER")}>`,
        },
      })
    })
  ],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule { }
