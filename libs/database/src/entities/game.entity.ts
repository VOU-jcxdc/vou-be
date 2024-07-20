import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameTypeEnum, IGame } from "@types";
import { GameImage } from "./game_image.entity";

@Entity({ name: "games" })
export class Game extends BaseEntity implements IGame {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @OneToMany(() => GameImage, image => image.gameId)
  readonly images: GameImage[];

  @Column({ name: "type", type: "enum", enum: GameTypeEnum, nullable: false })
  type: GameTypeEnum;

  @Column({ name: "exchange_status", type: "boolean", default: false, nullable: false })
  exchangeStatus: boolean;

  @Column({ name: "instruction", type: "text", nullable: false })
  instruction: string;
}
