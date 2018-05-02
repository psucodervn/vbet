import { HttpService, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { LeagueRequest, Match } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchSchema } from './schemas/match.schema';

// prettier-ignore
const headers = {
  'pragma': 'no-cache',
  'accept-language': 'en-US,en;q=0.9,de;q=0.8,vi;q=0.7',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
  'accept': 'application/json, text/plain, */*',
  'cache-control': 'no-cache',
  'authority': 'game.let.bet',
  'x-requested-with': 'XMLHttpRequest',
  'referer': 'https://game.let.bet/sport',
};

// prettier-ignore
const getUpcomingOptions = (league: LeagueRequest) => ({
  url: `https://game.let.bet/api/game/sports/matches?country_id=` +
  `&league_id=${league.id}&bet_type=${league.bet_type}&size=100&current_page=1` +
  `&sorts=kick_off_time&match_status=NotLiveYet&sport_id=${league.sport_id}&page=1`,
  headers,
});

// prettier-ignore
const getPastOptions = (league: LeagueRequest) => ({
  url: `https://game.let.bet/api/game/sports/matches` +
  `?league_id=${league.id}&bet_type=${league.bet_type}&sorts=-kick_off_time&current_page=1` +
  `&match_status=Live%2CFullTime%2CPostponed%2CCancelled%2CWalkover%2CInterrupted%2CAbandoned%2CRetired` +
  `&sport_id=${league.sport_id}&page=1&size=100`,
  headers,
});

@Injectable()
export class CrawlerService implements OnModuleInit {
  private logger: Logger = new Logger(CrawlerService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(MatchSchema) private readonly matchModel: Model<Match>,
  ) {}

  async onModuleInit() {
    await this.matchModel.ensureIndexes();
  }

  fetchMatches = async (requestOptions: object): Promise<Match[]> => {
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

    const matches: Match[] = resp.data.data.content;
    return matches;
  };

  processPast = async (job: Job, done: DoneCallback) => {
    try {
      const league: LeagueRequest = job.data.league;
      this.logger.log('FetchPast ' + league.name);

      const matches = await this.fetchMatches(getPastOptions(league));
      const result = await this.matchModel.insertMany(matches, {
        ordered: false,
        rawResult: false,
      });
      result.forEach(value => this.logger.error(value.errors.toString()));
      done(null, 'past ' + result.length);
    } catch (e) {
      done(e);
    }
  };

  processUpcoming = async (job: Job, done: DoneCallback) => {
    try {
      const league: LeagueRequest = job.data.league;
      this.logger.log('FetchUpcoming ' + league.name);

      const matches = await this.fetchMatches(getPastOptions(league));
      const result = await this.matchModel.insertMany(matches, {
        ordered: false,
        rawResult: false,
      });
      result.forEach(value => this.logger.error(value.errors.toString()));
      done(null, 'past ' + result.length);
    } catch (e) {
      done(e);
    }
  };
}
