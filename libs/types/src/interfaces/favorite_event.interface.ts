import { IEvent } from "./event.interface";

export interface IFavoriteEvent {
  id: string;
  accountId: string;
  eventId: string;

  // Relations
  readonly event: IEvent;
}
