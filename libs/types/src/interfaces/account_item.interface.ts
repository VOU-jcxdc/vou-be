import { AccountItemStatusEnum } from "../enums";
import { IItem } from "./item.interface";

export interface IAccountItem {
  id: string;
  accountId: string;
  status: AccountItemStatusEnum;
  assignedDate: Date;

  // Relations
  readonly itemId: IItem;
}
