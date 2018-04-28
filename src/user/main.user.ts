import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import * as path from 'path';
import { ConfigService } from '../shared/config.service';

let config: ConfigService;

async function bootstrap() {
  const userContext = await NestFactory.createApplicationContext(UserModule);
  config = userContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: path.join(__dirname, '../../data/user.proto'),
      url: config.get('grpc').url,
    },
  });
  await app.listenAsync();
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
