import { BaseEntity } from "typeorm";
import { IGame } from "./game.interface";

export interface IGameImage extends BaseEntity {
  id: string;
  gameId: string;
  bucketId: string;

  // Relations
  readonly game: IGame;
}
