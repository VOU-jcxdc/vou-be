import { BaseEntity } from "typeorm";
import { GameTypeEnum } from "../enum";
import { IGameImage } from "@types";

export interface IGame extends BaseEntity {
  id: string;
  name: string;
  type: GameTypeEnum;
  exchangeStatus: boolean;
  instruction: string; 

  // Relations
  readonly images: IGameImage[];
}
