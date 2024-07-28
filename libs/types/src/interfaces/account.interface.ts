import { AccountRoleEnum, AccountStatusEnum } from "../enums";
import { IBrandInfo } from "./brand_info.interface";
import { IPlayerInfo } from "./player_info.interface";

export interface IAccount {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  status: AccountStatusEnum;
  role: AccountRoleEnum;
  createdOn: Date;
  updatedOn: Date;
  deletedOn: Date;
  createdBy: string;
  updatedBy: string;
  bucketId: string;

  // Relations
  readonly brandInfo: IBrandInfo;
  readonly playerInfo: IPlayerInfo;
}
