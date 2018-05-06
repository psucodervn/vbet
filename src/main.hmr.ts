import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api/api.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  await app.startAllMicroservicesAsync();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
