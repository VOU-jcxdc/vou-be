import { GiftStatusEnum } from "../enums";
import { IItem } from "./item.interface";

export interface IGift {
  senderId: string;
  receiverId: string;
  eventId: string;
  sendDate: Date;
  itemId: string;
  updatedOn: Date;
  quantity: number;
  status: GiftStatusEnum;

  // Relations
  readonly item: IItem;
}
