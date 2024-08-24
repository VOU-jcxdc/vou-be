import { EventStatusEnum } from "../enums/event-status.enum";
import { IEventImage } from "./event_image.interface";
import { IFavoriteEvent } from "./favorite_event.interface";
import { IGame } from "./game.interface";

export interface IEvent {
  id: string;
  name: string;
  gameId: string;
  brandId: string;
  beginDate: Date;
  endDate: Date;
  description: string;
  status: EventStatusEnum;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly images: IEventImage[];
  readonly favoriteList: IFavoriteEvent[];
  readonly game: IGame;
}
