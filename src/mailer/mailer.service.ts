import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { SendActivationLink } from './dto/send-activation-link.dto';

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

  private getActivationLinkFromToken(token: string) {
    return `${process.env.FRONTEND_HOST}/users/profile/confirm/email?token=${token}`;
  }
}
