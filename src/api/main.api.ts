import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { grpcOptions } from '../shared/grpc.options';
import { ConfigService } from '../shared/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.connectMicroservice(grpcOptions('user'));

  const options = new DocumentBuilder()
    .setTitle('VBet API')
    .setVersion('0.1.0')
    .addTag('football')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const port = parseInt(configService.get('app').port, 10);
  await app.listen(port);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
