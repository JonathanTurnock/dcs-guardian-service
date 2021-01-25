import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error'],
  });
  const logger = new Logger('bootstrap');
  const configService = app.get(ConfigService);

  logger.log(`DCS Launching from ${configService.get('dcsServer.launcher')}`);
  await app.listen(45371);
}

bootstrap();
