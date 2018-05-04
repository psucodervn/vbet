import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../shared/config.service';
import { CrawlerController } from './crawler.controller';
import { BullModule } from 'nest-bull';
import { CrawlerService } from './crawler.service';
import { DoneCallback, Job } from 'bull';
import { getAppInstance } from './main.crawler';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './schemas/match.schema';

const configService = new ConfigService(`config.yaml`);
const redisOptions = configService.get('redis');
let service: CrawlerService;

const getService = async () => {
  if (!service) {
    const app = await getAppInstance();
    service = app.get<CrawlerService>(CrawlerService);
  }
  return service;
};

const FetchProcessor = async (job: Job, done: DoneCallback) => {
  return (await getService()).processRequest(job, done);
};

@Module({
  imports: [
    HttpModule,
    // prettier-ignore
    BullModule.forRoot([{
      name: 'fetcher',
      options: {
        redis: redisOptions,
        defaultJobOptions: {
          backoff: { type: 'exponential', delay: 5000 },
        },
        limiter: { max: 1, duration: 5000 },
      },
      processors: [{
        name: 'fetchPast',
        callback: FetchProcessor,
      }, {
        name: 'fetchUpcoming',
        callback: FetchProcessor,
      }],
    }]),
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}

@Module({
  imports: [
    MongooseModule.forRoot(configService.get('mongo').conn),
    CrawlerModule,
  ],
  providers: [
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
})
export class AppModule {}
