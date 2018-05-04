import { HttpService, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DoneCallback, Job, Queue } from 'bull';
import { Match, FetchRequest, FetchResponse } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchSchema } from './schemas/match.schema';
import { getOptions } from './crawler.util';
import { InjectQueue } from 'nest-bull';

@Injectable()
export class CrawlerService implements OnModuleInit {
  private logger: Logger = new Logger(CrawlerService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(MatchSchema) private readonly matchModel: Model<Match>,
    @InjectQueue('fetcher') readonly queue: Queue,
  ) {}

  async onModuleInit() {
    await this.matchModel.ensureIndexes();

    this.queue.on('completed', (job, result) => {
      this.logger.log(`Job completed! Result: ${result}`);
    });
    this.queue.on('failed', (job, error) => {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
    });

    await this.addUpcomingJob();
    // await this.addPastJob();
  }

  fetchMatches = async (requestOptions: object): Promise<FetchResponse> => {
    const resp = await this.httpService.request(requestOptions).toPromise();
    if (
      !resp ||
      !resp.data ||
      resp.data.code !== 1 ||
      !resp.data.data ||
      !Array.isArray(resp.data.data.content)
    ) {
      throw new Error('invalid response');
    }

    return resp.data.data;
  };

  private saveMatches = async (matches: Match[]) => {
    await Promise.all(
      matches.map(async match => {
        await this.matchModel.findOneAndUpdate(
          { match_id: match.match_id },
          match,
          { upsert: true },
        );
      }),
    );
  };

  processRequest = async (job: Job, done: DoneCallback) => {
    try {
      const req: FetchRequest = Object.assign({}, job.data.req);
      const jobName: string = job.data.jobName;

      const options = getOptions(req);
      // prettier-ignore
      this.logger.log('Fetching league: ' + req.league_id + ', url: ' + options.url);
      const resp = await this.fetchMatches(options);
      await this.saveMatches(resp.content);

      // prettier-ignore
      done(null, `fetched ${resp.content.length} in page ${resp.current_page} of total ${resp.total_element}`);

      if (resp.current_page < resp.total_page) {
        req.current_page += 1;
        req.page += 1;
        await this.addJob(req, jobName);
      }
    } catch (e) {
      done(e);
    }
  };

  private addPastJob = async (league_id: string = '') => {
    const req: FetchRequest = {
      current_page: 1,
      league_id,
      bet_type: 'europe',
      country_id: '',
      page: 1,
      size: 100,
      sport_id: 'soccer',
      sorts: ['-kick_off_time'],
      match_status: [
        'Live',
        'FullTime',
        'Postponed',
        'Cancelled',
        'Walkover',
        'Interrupted',
        'Abandoned',
        'Retired',
      ],
    };
    await this.addJob(req, 'fetchUpcoming');
  };

  private addUpcomingJob = async (league_id: string = '') => {
    const req: FetchRequest = {
      current_page: 1,
      league_id,
      bet_type: 'europe',
      country_id: '',
      page: 1,
      size: 100,
      sport_id: 'soccer',
      sorts: ['kick_off_time'],
      match_status: ['NotLiveYet'],
    };
    await this.addJob(req, 'fetchUpcoming');
  };

  private addJob = async (req: FetchRequest, jobName: string) => {
    await this.queue.add(jobName, { req, jobName });
  };
}
