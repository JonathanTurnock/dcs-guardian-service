import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DcsServerClientService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async isRunning() {
    const response = await this.httpService
      .request({
        url: `${this.configService.get('dcsServer.basePath')}/encryptedRequest`,
        method: 'OPTIONS',
        timeout: 1000,
      })
      .toPromise();
    return response.status === 200;
  }
}
