import { BaseEntity } from "typeorm";

export interface IBucket extends BaseEntity {
  id: string;
  filename: string;
}
