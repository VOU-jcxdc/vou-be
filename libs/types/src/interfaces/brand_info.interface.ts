import { BaseEntity, Geometry } from "typeorm";

export interface IBrandInfo extends BaseEntity {
  name: string;
  id: string;
  accountId: string;
  field: string;
  address: string;
  gps: Geometry;
}
