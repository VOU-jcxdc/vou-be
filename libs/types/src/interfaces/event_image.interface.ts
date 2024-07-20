import { IEvent } from "./event.interface";

export interface IEventImage {
  id: string;
  eventId: string;
  bucketId: string;

  // Relations
  readonly event: IEvent;
}
