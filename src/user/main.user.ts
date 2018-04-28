import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { grpcOptions } from '../shared/grpc.options';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, grpcOptions);
  await app.listenAsync();
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
