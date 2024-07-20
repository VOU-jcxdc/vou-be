import { GenderEnum, IPlayerInfo } from "@types";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @OneToOne(() => Account, (account) => account.playerInfo)
  @JoinColumn({ name: "account_id", referencedColumnName: "id" })
  readonly account: Account;
}
