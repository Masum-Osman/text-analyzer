import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { LoggingInterceptor } from './shared/logging/logging.middleware';
import { CustomLogger } from './shared/logging/logger.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(), 
  });  
  
  app.use('/static', express.static(join(__dirname, '../', 'public')));
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
