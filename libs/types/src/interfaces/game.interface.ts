import { GameTypeEnum } from "../enums";
import { IGameImage } from "./game_image.interface";

export interface IGame {
  id: string;
  name: string;
  type: GameTypeEnum;
  exchangeStatus: boolean;
  instruction: string;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly images: IGameImage[];
}
