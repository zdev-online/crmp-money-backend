import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { SendActivationLink } from './dto/send-activation-link.dto';
import { SendRestoreLink } from './dto/send-restore-link.dto';

@Injectable()
export class MailerService {

  private logger = new Logger('MailerService');

  constructor(private nestMailerService: NestMailerService) { }

  public async sendActivationLink(dto: SendActivationLink): Promise<void> {
    try {
      await this.nestMailerService.sendMail({
        template: 'activation-link',
        to: dto.email,
        subject: "[CRMP - Money] Подтверждение регистрации",
        context: {
          activation_link: this.getActivationLinkFromToken(dto.token)
        }
      });
    } catch (error) {
      return this.logger.error(`Не удалось отправить письмо активации аккаунта: ${error}`);
    }
  }

  public async sendRestoreLink(dto: SendRestoreLink){
     try {
      await this.nestMailerService.sendMail({
        template: 'restore-link',
        to: dto.email,
        subject: "[CRMP - Money] Восстановление доступа",
        context: {
          restore_link: this.getRestoreConfirmLink(dto.token)
        }
      });
    } catch (error) {
      return this.logger.error(`Не удалось отправить письмо активации аккаунта: ${error}`);
    }
  }

  private getActivationLinkFromToken(token: string) {
    return `${process.env.FRONTEND_HOST}/profile/email/confirm?token=${token}`;
  }

  private getRestoreConfirmLink(token: string){
    return `${process.env.FRONTEND_HOST}/auth/restore/confirm?token=${token}`;
  }
}
