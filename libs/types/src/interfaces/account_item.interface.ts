import { AccountItemStatusEnum } from "../enums";
import { IItem } from "./item.interface";

export interface IAccountItem {
  id: string;
  accountId: string;
  status: AccountItemStatusEnum;
  assignedDate: Date;
  itemId: string;
  quantity: number;
  updatedOn: Date;

  // Relations
  readonly item: IItem;
}
