import { AccountRoleEnum, AccountStatusEnum, IAccount } from "@types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BrandInfo } from "./brand_info.entity";
import { PlayerInfo } from "./player_info.entity";
import { Bucket } from "./bucket.entity";

@Entity({ name: "accounts" })
export class Account extends BaseEntity implements IAccount {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "username", type: "varchar", length: 255, unique: true, nullable: false })
  username: string;

  @Column({ name: "password", type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ name: "email", type: "varchar", length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: "phone", type: "varchar", length: 16, unique: true, nullable: true })
  phone: string;

  @Column({ name: "status", type: "enum", enum: AccountStatusEnum, default: AccountStatusEnum.INACTIVE })
  status: AccountStatusEnum;

  @Column({ name: "role", type: "enum", enum: AccountRoleEnum, default: AccountRoleEnum.PLAYER })
  role: AccountRoleEnum;

  @Column({ name: "bucket_id", type: "uuid", nullable: true, default: null })
  bucketId: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", precision: null, default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({ name: "updated_on", type: "timestamp", precision: null, default: () => "CURRENT_TIMESTAMP" })
  updatedOn: Date;

  @DeleteDateColumn({ name: "deleted_on", type: "timestamp", precision: null, nullable: true })
  deletedOn: Date;

  @Column({ name: "created_by", type: "varchar", length: 255, nullable: true })
  createdBy: string;

  @Column({ name: "updated_by", type: "varchar", length: 255, nullable: true })
  updatedBy: string;

  @OneToOne(() => Bucket)
  @JoinColumn({ name: "bucket_id" })
  bucket: Bucket;

  @OneToOne(() => BrandInfo)
  brandInfo: BrandInfo;

  @OneToOne(() => PlayerInfo)
  playerInfo: PlayerInfo;
}
