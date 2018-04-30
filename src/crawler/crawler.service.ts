import { HttpService, Injectable, Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { League } from './interfaces';

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
const getUpcomingOptions = (league: League) => ({
  url: `https://game.let.bet/api/game/sports/matches?country_id=` +
  `&league_id=${league.id}&bet_type=${league.bet_type}&size=100&current_page=1` +
  `&sorts=kick_off_time&match_status=NotLiveYet&sport_id=${league.sport_id}&page=1`,
  headers,
});

// prettier-ignore
const getPastOptions = (league: League) => ({
  url: `https://game.let.bet/api/game/sports/matches` +
  `?league_id=${league.id}&bet_type=${league.bet_type}&sorts=-kick_off_time&current_page=1` +
  `&match_status=Live%2CFullTime%2CPostponed%2CCancelled%2CWalkover%2CInterrupted%2CAbandoned%2CRetired` +
  `&sport_id=${league.sport_id}&page=1&size=100`,
  headers,
});

@Injectable()
export class CrawlerService {
  private logger: Logger = new Logger(CrawlerService.name);
  constructor(private readonly httpService: HttpService) {}

  processPast = async (job: Job, done: DoneCallback) => {
    const league: League = job.data.league;
    this.logger.log('FetchPast ' + league.name);

    try {
      const resp = { data: { code: 2 } };
      // const resp = await this.httpService
      //   .request(getPastOptions(league))
      //   .toPromise();
      done(null, 'past ' + JSON.stringify(resp.data.code));
    } catch (e) {
      done(e);
    }
  };

  processUpcoming = async (job: Job, done: DoneCallback) => {
    const league: League = job.data.league;
    this.logger.log('FetchUpcoming ' + league.name);

    try {
      const resp = { data: { code: 2 } };
      // const resp = await this.httpService
      //   .request(getUpcomingOptions(league))
      //   .toPromise();
      done(null, 'upcoming ' + JSON.stringify(resp.data.code));
    } catch (e) {
      done(e);
    }
  };
}
