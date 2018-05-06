import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { SharedModule } from '../shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from '../shared/schemas/match.schema';
import { UserController } from './user.controller';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  controllers: [ApiController, UserController],
  providers: [ApiService],
})
export class ApiModule {}
