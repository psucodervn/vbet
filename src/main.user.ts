import { NestFactory } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { Transport } from '@nestjs/microservices';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: path.join(__dirname, '../resources/user.proto'),
      url: '0.0.0.0:4000',
    },
  });
  await app.listenAsync();
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
