import { BaseEntity } from "typeorm";
import { IEvent } from "./event.interface";

export interface IEventImage extends BaseEntity {
  id: string;
  eventId: string;
  bucketId: string;

  // Relations
  readonly event: IEvent;
}
