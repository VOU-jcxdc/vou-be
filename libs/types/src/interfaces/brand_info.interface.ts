import { Geometry } from "typeorm";
import { IAccount } from "./account.interface";

export interface IBrandInfo {
  name: string;
  id: string;
  accountId: string;
  field: string;
  address: string;
  gps: Geometry;

  //Relations;
  readonly account: IAccount;
}
