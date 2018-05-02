import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema({
  match_id: {
    type: 'String',
    index: {
      unique: true,
    },
  },
  sport_id: {
    type: 'String',
  },
  country: {
    country_id: {
      type: 'String',
    },
    country_name: {
      type: 'String',
    },
  },
  league: {
    league_id: {
      type: 'String',
      index: true,
    },
    league_name: {
      type: 'String',
    },
  },
  home_team: {
    type: 'String',
  },
  away_team: {
    type: 'String',
  },
  home_score: {
    type: 'Number',
  },
  half_time_home_score: {
    type: 'Number',
  },
  away_score: {
    type: 'Number',
  },
  half_time_away_score: {
    type: 'Number',
  },
  kick_off_time: {
    type: 'Number',
  },
  kick_off: {
    type: 'Boolean',
  },
  in_match_time: {
    type: 'Number',
  },
  match_status: {
    type: 'String',
  },
  last_updated: {
    type: 'Number',
  },
  odd_1x2: {
    match_id: {
      type: 'String',
    },
    book_marker: {
      type: 'String',
    },
    updated_time: {
      type: 'Number',
    },
    win_rate: {
      type: 'Number',
    },
    draw_rate: {
      type: 'Number',
    },
    lose_rate: {
      type: 'Number',
    },
  },
});
