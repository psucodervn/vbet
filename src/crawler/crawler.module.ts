import { HttpModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../shared/config.service';
import { CrawlerController } from './crawler.controller';
import { BullModule, InjectQueue } from 'nest-bull';
import { CrawlerService } from './crawler.service';
import { DoneCallback, Job, Queue } from 'bull';
import { LeagueRequest } from './interfaces';
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

const PastProcessor = async (job: Job, done: DoneCallback) => {
  return (await getService()).processPast(job, done);
};

const UpcomingProcessor = async (job: Job, done: DoneCallback) => {
  return (await getService()).processUpcoming(job, done);
};

const sport = { sport_id: 'soccer', bet_type: 'europe' };
const leagues: LeagueRequest[] = [
  { name: 'UEFA Champions League', id: '1040', ...sport },
  { name: 'England Premier League', id: '94', ...sport },
  { name: 'Spain Primera Liga', id: '207', ...sport },
  { name: 'Italy Serie A', id: '199', ...sport },
];

@Module({
  imports: [
    HttpModule,
    // prettier-ignore
    BullModule.forRoot([{
      name: 'fetcher',
      options: redisOptions,
      processors: [{
        name: 'fetchPast',
        callback: PastProcessor,
      }, {
        name: 'fetchUpcoming',
        callback: UpcomingProcessor,
      }],
    }]),
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule implements OnModuleInit {
  private readonly logger = new Logger(CrawlerModule.name);

  constructor(@InjectQueue('fetcher') readonly queue: Queue) {}

  async onModuleInit() {
    for (const league of leagues) {
      // past queue
      // prettier-ignore
      const jobPast = await this.queue
        .add('fetchPast', { league }, {
          repeat: { cron: '*/2 * * * *' },
          removeOnFail: false,
          jobId: `bull:fetchPast:${league.id}`,
        });
      // prettier-ignore
      this.logger.log(`Job ${jobPast.id} for getting past matches of ${league.name} started.`);

      // upcoming queue
      // prettier-ignore
      const jobUp = await this.queue
        .add('fetchUpcoming', { league }, {
          repeat: { cron: '*/1 * * * *' },
          removeOnFail: false,
          jobId: `bull:fetchUpcoming:${league.id}`,
        });
      // prettier-ignore
      this.logger.log(`Job ${jobUp.id} for getting upcoming matches of ${league.name} started.`);
    }

    this.queue.on('completed', (job, result) => {
      this.logger.log(`Job completed! Result: ${result}`);
    });
    this.queue.on('failed', (job, error) => {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
    });
  }
}

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
