import { IGame } from "./game.interface";

export interface IGameImage {
  id: string;
  gameId: string;
  bucketId: string;

  // Relations
  readonly game: IGame;
}
