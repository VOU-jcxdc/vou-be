import { BaseEntity } from "typeorm";
import { AccountRoleEnum, AccountStatusEnum } from "../enum";
import { IBrandInfo } from "./brand_info.interface";
import { IBucket } from "./bucket.interface";
import { IPlayerInfo } from "./player_info.interface";

export interface IAccount extends BaseEntity {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: AccountStatusEnum;
  role: AccountRoleEnum;
  createdOn: Date;
  updatedOn: Date;
  deletedOn: Date;
  createdBy: string;
  updatedBy: string;
  bucketId: string;

  // Relations
  readonly bucket: IBucket;
  readonly brandInfo: IBrandInfo;
  readonly playerInfo: IPlayerInfo;
}
