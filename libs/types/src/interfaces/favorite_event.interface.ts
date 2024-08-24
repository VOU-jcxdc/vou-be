import { IEvent } from "./event.interface";

export interface IFavoriteEvent {
  id: string;
  accountId: string;
  eventId: string;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly event: IEvent;
}
