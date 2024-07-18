import { GenderEnum, IPlayerInfo } from "@types";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
