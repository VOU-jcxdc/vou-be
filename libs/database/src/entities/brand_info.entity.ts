import { IBrandInfo } from "@types";
import { BaseEntity, Column, Entity, Geometry, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToOne(() => Account, (account) => account.brandInfo)
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  readonly account: Account;
}
