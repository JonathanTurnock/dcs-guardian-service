import { Controller, Post } from '@nestjs/common';

@Controller()
export class DcsStubController {
  @Post('encryptedRequest')
  postEncryptedRequest(): void {
    return;
  }
}
