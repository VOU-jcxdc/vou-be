import { IGameImage } from "@types";
import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Game } from "./game.entity";

@Entity({ name: "game_images" })
export class GameImage extends BaseEntity implements IGameImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "game_id", type: "uuid", nullable: false })
  gameId: string;

  @Column({ name: "bucket_id", type: "uuid", nullable: false })
  bucketId: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @ManyToOne(() => Game, (game) => game.images)
  @JoinColumn({ name: "game_id", referencedColumnName: "id" })
  readonly game: Game;
}
