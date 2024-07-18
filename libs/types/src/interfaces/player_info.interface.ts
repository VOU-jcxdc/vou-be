import { BaseEntity } from "typeorm";
import { GenderEnum } from "../enum";

export interface IPlayerInfo extends BaseEntity {
  id: string;
  accountId: string;
  gender: GenderEnum;
  dob: Date;
}
