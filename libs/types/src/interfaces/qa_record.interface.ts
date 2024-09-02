export interface IPlayerAnswer {
  userId: string;
  answer: number;
}

export interface IQARecord {
  QAId: string;
  playerAnswer: IPlayerAnswer[];
  updatedOn: Date;
  createdOn: Date;
}
