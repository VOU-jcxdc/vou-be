import { IEvent } from "./event.interface";

export interface IEventImage {
  id: string;
  eventId: string;
  bucketId: string;
  createdOn: Date;
  updatedOn: Date;

  // Relations
  readonly event: IEvent;
}
