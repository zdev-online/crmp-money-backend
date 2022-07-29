import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { SendActivationLink } from './dto/send-activation-link.dto';
import { SendRestoreLink } from './dto/send-restore-link.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private logger = new Logger('MailerService');

  constructor(
    private nestMailerService: NestMailerService,
    private configService: ConfigService
  ) { }

  public async sendActivationLink(dto: SendActivationLink): Promise<void> {
    try {
      await this.nestMailerService.sendMail({
        template: 'activation-link',
        to: dto.email,
        subject: '[CRMP - Money] Подтверждение регистрации',
        context: {
          activation_link: this.getActivationLinkFromToken(dto.token),
        },
      });
    } catch (error) {
      return this.logger.error(
        `Не удалось отправить письмо активации аккаунта: ${error}`,
      );
    }
  }

  public async sendRestoreLink(dto: SendRestoreLink) {
    try {
      await this.nestMailerService.sendMail({
        template: 'restore-link',
        to: dto.email,
        subject: '[CRMP - Money] Восстановление доступа',
        context: {
          restore_link: this.getRestoreConfirmLink(dto.token),
        },
      });
    } catch (error) {
      return this.logger.error(
        `Не удалось отправить письмо активации аккаунта: ${error}`,
      );
    }
  }

  private getActivationLinkFromToken(token: string) {
    const frontend_host = this.configService.get("FRONTEND_HOST");
    const frontend_email_confirm_path = this.configService.get("FRONTEND_EMAIL_CONFIRM_PATH");
    const link = new URL(`${frontend_email_confirm_path}?token=${token}`, frontend_host);
    return link.toString();
  }

  private getRestoreConfirmLink(token: string) {
    const frontend_host = this.configService.get("FRONTEND_HOST");
    const frontend_restore_path = this.configService.get("FRONTEND_RESTORE_PATH");
    const link = new URL(`${frontend_restore_path}?token=${token}`, frontend_host);
    return link.toString();
  }
}
