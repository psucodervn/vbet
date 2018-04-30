import { HttpModule, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../shared/config.service';
import { CrawlerController } from './crawler.controller';
import { BullModule, InjectQueue } from 'nest-bull';
import { CrawlerService } from './crawler.service';
import { DoneCallback, Job, Queue } from 'bull';
import { League, Sport } from './interfaces';
import { getAppInstance } from './main.crawler';

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

const soccer: Sport = { sport_id: 'soccer', bet_type: 'europe' };
const leagues: League[] = [
  {
    name: 'UEFA Champions League',
    id: 1040,
    ...soccer,
  },
  {
    name: 'England Premier League',
    id: 94,
    ...soccer,
  },
];

@Module({
  imports: [
    HttpModule,
    // prettier-ignore
    BullModule.forRoot([{
      name: 'fetchPast',
      options: redisOptions,
      processors: [{
        name: 'fetchPast',
        callback: PastProcessor,
      }],
    }, {
      name: 'fetchUpcoming',
      options: redisOptions,
      processors: [{
        name: 'fetchUpcoming',
        callback: UpcomingProcessor,
      }],
    }]),
  ],
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    {
      provide: ConfigService,
      useValue: configService,
    },
  ],
})
export class CrawlerModule implements OnModuleInit {
  private readonly logger = new Logger(CrawlerModule.name);

  constructor(@InjectQueue('fetchUpcoming') readonly queue: Queue) {}

  onModuleInit(): any {
    console.log('CrawlerModule on init');
    for (const league of leagues) {
      // // past queue
      // await this.queue.add('fetchPast', { league: Object.assign({}, league) });
      // // prettier-ignore
      // const jobPast = await this.queue
      //   .add('fetchPast', { league: Object.assign({}, league) }, {
      //     repeat: { cron: '*/10 * * * *' },
      //     removeOnFail: false,
      //     removeOnComplete: false,
      //   });
      // // prettier-ignore
      // this.logger.log(`Job ${jobPast.id} for getting past matches of ${league.name} started.`);

      // upcoming queue
      // this.queue.add(
      //   'fetchUpcoming',
      //   {
      //     league: Object.assign({}, league),
      //   },
      //   {
      //     jobId: `bull:fetchUpcoming:${league.id}`,
      //   },
      // );
      // prettier-ignore
      // const jobUp = await ;
      this.queue
        .add('fetchUpcoming', { league: Object.assign({}, league) }, {
          repeat: { cron: '*/1 * * * *' },
          removeOnFail: false,
          jobId: `bull:fetchUpcoming:${league.id}`,
        });
      // prettier-ignore
      // this.logger.log(`Job ${jobUp.id} for getting upcoming matches of ${league.name} started.`);
    }

    this.queue.on('completed', (job, result) => {
      this.logger.log(`Job completed! Result: ${result}`);
    });
    this.queue.on('failed', (job, error) => {
      this.logger.error(error.message);
    });
  }
}
