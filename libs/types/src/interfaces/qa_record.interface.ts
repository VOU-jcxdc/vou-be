export interface IPlayerScore {
  userId: string;
  score: number;
}

export interface IQARecord {
  roomId: string;
  playerScore: IPlayerScore[];
}
