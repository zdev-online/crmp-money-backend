export class GoogleVerifyResponseDto {
  success: boolean;
  challenge_ts: Date;
  hostname: string;
  'error-codes'?: string[];
}
