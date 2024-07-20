import { GenderEnum } from "../enum";
import { IAccount } from "./account.interface";

export interface IPlayerInfo {
  id: string;
  accountId: string;
  gender: GenderEnum;
  dob: Date;

  // Relations;
  readonly account: IAccount;
}
