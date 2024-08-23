import { IBrandInfo } from "@types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Geometry,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./account.entity";

@Entity({ name: "brands_info" })
export class BrandInfo extends BaseEntity implements IBrandInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ name: "field", type: "varchar", length: 255, nullable: false })
  field: string;

  @Column({ name: "address", type: "varchar", length: 255, nullable: false })
  address: string;

  @Column({ name: "gps", type: "geometry", nullable: false })
  gps: Geometry;

  @Column({ name: "account_id", type: "uuid", nullable: false })
  accountId: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @OneToOne(() => Account, (account) => account.brandInfo)
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  readonly account: Account;
}
