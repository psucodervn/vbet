import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { grpcOptions } from '../shared/grpc.options';
import { ConfigService } from '../shared/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcOptions('user'));

  const configService: ConfigService = app.get(ConfigService);

  const port = parseInt(configService.get('app').port, 10);
  await app.listen(port);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
