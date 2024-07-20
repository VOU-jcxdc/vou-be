import { IGameImage } from "@types";
import { BaseEntity, Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity({ name: "game_images" })
export class GameImage extends BaseEntity implements IGameImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "game_id", type: "uuid", nullable: false })
  gameId: string;

  @Column({ name: "bucket", type: "uuid", nullable: false })
  bucketId: string;

  @ManyToOne(() => Game, (game) => game.images)
  @JoinColumn({ name: "game_id", referencedColumnName: "id" })
  game: Game;
}
