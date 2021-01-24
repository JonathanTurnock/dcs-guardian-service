import { NestFactory } from '@nestjs/core';
import { DcsStubModule } from './dcs-stub.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(DcsStubModule, {
    cors: {
      origin: '*',
      methods: 'POST',
      preflightContinue: false,
      optionsSuccessStatus: 200,
    },
    logger: ['warn', 'error'],
  });
  app.disable('x-powered-by');
  await app.listen(8088);
}

bootstrap();
