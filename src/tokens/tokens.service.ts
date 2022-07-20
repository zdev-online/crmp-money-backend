import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { RefreshTokenPayloadDto } from './dto/refresh-token-payload.dto';
import { TokensEntity } from './tokens.entity';

@Injectable()
export class TokensService {
  private logger = new Logger('TokenService');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(TokensEntity)
    private tokenRepository: Repository<TokensEntity>,
  ) {}

  public async generateAccessToken(payload: {
    [key: string]: any;
  }): Promise<string> {
    const secret = this.getAccessTokensSecret();
    const expiresIn = this.getAccessTokensExpireTime();

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  public async verifyAccessToken<T extends object = any>(
    access_token: string,
  ): Promise<T | null> {
    try {
      const decoded_data = await this.jwtService.verifyAsync<T>(access_token, {
        secret: this.getAccessTokensSecret(),
      });
      return decoded_data;
    } catch (error) {
      return null;
    }
  }

  public getAccessTokensExpireTime(): number {
    return +this.configService.get<number>('JWT_ACCESS_TTL_MS');
  }

  public getAccessTokensSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  public async generateRefreshToken(
    payload: RefreshTokenPayloadDto,
  ): Promise<string> {
    const secret = this.getRefreshTokensSecret();
    const expiresIn = this.getRefreshTokensExpireTime();

    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  public async verifyRefreshToken(
    refresh_token: string,
  ): Promise<RefreshTokenPayloadDto | null> {
    try {
      const decoded_data =
        await this.jwtService.verifyAsync<RefreshTokenPayloadDto>(
          refresh_token,
          {
            secret: this.getRefreshTokensSecret(),
          },
        );
      return decoded_data;
    } catch (error) {
      return null;
    }
  }

  public getRefreshTokensExpireTime(): number {
    return +this.configService.get<number>('JWT_REFRESH_TTL_MS');
  }

  public getRefreshTokensSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  public async saveRefreshToken(
    value: string,
    uuid: string,
    user_id: number,
  ): Promise<TokensEntity> {
    return this.tokenRepository.save({
      value,
      uuid,
      expires_at: this.getRefreshTokensExpireTime() + Date.now(),
      user_id,
    });
  }

  public async findByUuid(uuid: string): Promise<TokensEntity | null> {
    return this.tokenRepository.findOneBy({ uuid });
  }

  public async deleteTokenByUuid(uuid: string) {
    return this.tokenRepository.delete({ uuid });
  }

  public async deleteTokensByUserId(user_id: number) {
    return this.tokenRepository.delete({ user_id });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'delete-expired-tokens' })
  public async deleteExpiredTokens(): Promise<void> {
    try {
      const deleted = await this.tokenRepository.delete({
        expires_at: LessThanOrEqual(Date.now()),
      });

      return this.logger.log(
        `Удалено просроченных токенов: ${deleted.affected}`,
      );
    } catch (error) {
      return this.logger.error(`Не удалось удалить токены: ${error}`);
    }
  }

  public generateResetToken(user_id: number) {
    return this.generateAccessToken({ user_id });
  }
}
