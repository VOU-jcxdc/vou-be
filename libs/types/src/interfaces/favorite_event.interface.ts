import { BaseEntity } from "typeorm";
import { IEvent } from "./event.interface";

export interface IFavoriteEvent extends BaseEntity {
  id: string;
  accountId: string;
  eventId: string;

  // Relations
  readonly event: IEvent;
}
