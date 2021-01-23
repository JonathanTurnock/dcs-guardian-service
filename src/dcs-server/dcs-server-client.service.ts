import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class DcsServerClientService {
  constructor(private httpService: HttpService) {}

  async isRunning() {
    const response = await this.httpService
      .request({
        url: 'http://falcon.fxq.net:8088/encryptedRequest',
        method: 'OPTIONS',
        timeout: 500,
      })
      .toPromise();
    return response.status === 200;
  }
}
