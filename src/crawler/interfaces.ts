export interface Sport {
  readonly sport_id: string;
  readonly bet_type: string;
}

export interface League extends Sport {
  readonly name: string;
  readonly id: number;
}
