import { Document } from 'mongoose';

export interface Match extends Document {
  match_id: string;
  sport_id: string;
  country: Country;
  league: League;
  home_team: string;
  away_team: string;
  home_score: number;
  half_time_home_score: number;
  away_score: number;
  half_time_away_score: number;
  kick_off_time: number;
  kick_off: boolean;
  in_match_time: number;
  match_status: string;
  last_updated: number;
  odd_1x2: Odd1x2;
}

export interface Country {
  country_id: string;
  country_name: string;
}

export interface League {
  league_id: string;
  league_name: string;
}

export interface Odd1x2 {
  match_id: string;
  book_marker: string;
  updated_time: number;
  win_rate: number;
  draw_rate: number;
  lose_rate: number;
}

export interface LeagueRequest {
  id: string;
  name: string;
  sport_id: string;
  bet_type: string;
}

export interface FetchRequest {
  league_id: string;
  sport_id: string;
  bet_type: string;
  country_id: string;
  sorts: string[];
  current_page: number;
  match_status: string[];
  page: number;
  size: number;
}

export interface FetchResponse {
  current_page: number;
  from: number;
  size: number;
  total_element: number;
  total_page: number;
  content: Match[];
}
