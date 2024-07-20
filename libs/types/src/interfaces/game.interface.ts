import { GameTypeEnum } from "../enum";
import { IGameImage } from "./game_image.interface";

export interface IGame {
  id: string;
  name: string;
  type: GameTypeEnum;
  exchangeStatus: boolean;
  instruction: string;

  // Relations
  readonly images: IGameImage[];
}
