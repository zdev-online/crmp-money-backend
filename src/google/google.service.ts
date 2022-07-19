import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleVerifyResponseDto } from './dto/google-verify-response.dto';

@Injectable()
export class GoogleService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private logger = new Logger('GoogleService');
  private captcha_error_to_log = [
    'missing-input-secret',
    'invalid-input-secret',
  ];

  public async verifyCaptchaOrThrow(recaptcha_token: string): Promise<void> {
    const response =
      await this.httpService.axiosRef.post<GoogleVerifyResponseDto>(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          response: recaptcha_token,
          secret: this.configService.get('GOOGLE_RECAPTCHA_SECRET'),
        },
      );

    const { success } = response.data;
    if (!success) {
      const has_critical_error = response.data['error-codes'].some((error) =>
        this.captcha_error_to_log.includes(error),
      );
      if (has_critical_error) {
        this.logger.error(
          `Google ReCaptcha Error: ${response.data['error-codes'].join(',')}`,
        );
        throw new InternalServerErrorException({
          message: 'Внутренняя ошибка сервера',
        });
      }
      throw new BadRequestException({
        message: 'Капча не пройдена',
        errors: response.data['error-codes'],
      });
    }
  }
}
