import { IItem } from "./item.interface";

export interface IGift {
  senderId: string;
  receiverId: string;
  gameId: string;
  sendDate: Date;
  itemId: string;

  // Relations
  readonly item: IItem;
}
