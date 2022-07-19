import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public async index() {
    return { time: Date.now() };
  }
}
