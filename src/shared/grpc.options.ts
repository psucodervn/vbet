import { ClientOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { ConfigService } from './config.service';

const configService: ConfigService = new ConfigService(`config.yaml`);
const grpcConfigs = configService.get('grpc');

export const grpcOptions: ((name: string) => ClientOptions) = (
  name: string,
) => ({
  transport: Transport.GRPC,
  options: {
    package: name,
    url: grpcConfigs[name].url,
    protoPath: grpcConfigs[name].file_path,
  },
});
