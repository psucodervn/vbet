import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config.service';

const configService = new ConfigService(`config.yaml`);

@Module({
  imports: [MongooseModule.forRoot(configService.get('mongo').conn)],
  providers: [
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
})
export class SharedModule {}
