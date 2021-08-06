import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const origins = config.get('ORIGIN');
  logger.log('Origins', origins);
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  if (config.get('DEBUG') === 'true') {
    mongoose.set('debug', true);
  }

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
