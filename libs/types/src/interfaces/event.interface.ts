import { BaseEntity } from "typeorm";
import { IEventImage, IFavoriteEvent, IGame } from "@types";

export interface IEvent extends BaseEntity {
  id: string;
  name: string;
  gameId: string;
  brandId: string;
  beginDate: Date;
  endDate: Date;
  description: string;

  // Relations
  readonly images: IEventImage[];
  readonly favoriteList: IFavoriteEvent[];
  readonly game: IGame;
}
