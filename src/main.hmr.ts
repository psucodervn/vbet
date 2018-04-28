import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { grpcOptions } from './shared/grpc.options';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcOptions);
  await app.startAllMicroservicesAsync();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
