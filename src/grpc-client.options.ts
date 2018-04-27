import { ClientOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: path.join(__dirname, './user/user.proto'),
  },
};
