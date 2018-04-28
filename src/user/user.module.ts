import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigService } from '../shared/config.service';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`config.yaml`),
    },
  ],
})
export class UserModule {}
