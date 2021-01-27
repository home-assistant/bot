import { SentryInterceptor } from '@app/sentry';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import Config from './config';

const config = Config.getProperties();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add sentry as error reporter
  app.useGlobalInterceptors(new SentryInterceptor());

  await app.listen(config.server.port);
}
bootstrap();
