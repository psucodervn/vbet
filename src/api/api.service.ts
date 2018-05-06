import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Match } from '../shared/interfaces';
import { MatchSchema } from '../shared/schemas/match.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ApiService {
  constructor(
    @InjectModel(MatchSchema) private readonly matchModel: Model<Match>,
  ) {}

  async getLeagues() {
    return await this.matchModel
      .aggregate()
      .group({
        _id: '$league.league_id',
        id: {
          $first: '$league.league_id',
        },
        name: {
          $first: '$league.league_name',
        },
        count: {
          $sum: 1,
        },
      })
      .sort({ name: 1 })
      .exec();
  }
}
