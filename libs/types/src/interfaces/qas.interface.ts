export interface IQAOption {
  content: string;
}

export interface IQAs {
  question: string;
  options: IQAOption[];
  answer: number;
  updatedOn: Date;
  createdOn: Date;
}
