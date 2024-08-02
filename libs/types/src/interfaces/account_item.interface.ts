import { AccountItemStatusEnum } from "../enums";
import { IItem } from "./item.interface";

export interface IAccountItem {
  id: string;
  accountId: string;
  status: AccountItemStatusEnum;
  assignedDate: Date;
  itemId: string;

  // Relations
  readonly item: IItem;
}
