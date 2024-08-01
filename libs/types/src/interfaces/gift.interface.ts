import { IItem } from "./item.interface";

export interface IGift {
  senderId: string;
  receiverId: string;
  gameId: string;
  sendDate: Date;

  // Relations
  readonly itemId: IItem;
}
