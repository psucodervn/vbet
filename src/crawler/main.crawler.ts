import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import { INestApplicationContext } from '@nestjs/common';

let app: INestApplicationContext = null;

async function bootstrap() {
  app = await NestFactory.createApplicationContext(CrawlerModule);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();

async function getAppInstance(): Promise<INestApplicationContext> {
  if (!app) {
    await bootstrap();
  }
  return app;
}

export { getAppInstance };
