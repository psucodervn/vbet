import { ClientOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { ConfigService } from './config.service';

const configService: ConfigService = new ConfigService(`config.yaml`);

export const grpcOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: path.join(__dirname, '../../data/user.proto'),
    url: configService.get('grpc').url,
  },
};
