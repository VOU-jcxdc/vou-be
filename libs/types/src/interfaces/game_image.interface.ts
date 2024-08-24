import { IGame } from "./game.interface";

export interface IGameImage {
  id: string;
  gameId: string;
  bucketId: string;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly game: IGame;
}
