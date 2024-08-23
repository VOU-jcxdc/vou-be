import { GenderEnum, IPlayerInfo } from "@types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./account.entity";

@Entity({ name: "players_info" })
export class PlayerInfo extends BaseEntity implements IPlayerInfo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "gender", type: "enum", enum: GenderEnum, nullable: true, default: null })
  gender: GenderEnum;

  @Column({ name: "dob", type: "date", nullable: true, default: null })
  dob: Date;

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

  @OneToOne(() => Account, (account) => account.playerInfo)
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  readonly account: Account;
}
