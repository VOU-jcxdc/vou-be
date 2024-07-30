import { IEvent } from "@types";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventImage } from "./event_image.entity";
import { Game } from "./game.entity";
import { FavoriteEvent } from "./favorite_event.entity";

@Entity({ name: "events" })
export class Event extends BaseEntity implements IEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ name: "game_id", type: "uuid", nullable: true })
  gameId: string;

  @Column({ name: "brand_id", type: "uuid", nullable: false })
  brandId: string;

  @Column({ name: "begin_date", type: "timestamp", nullable: false })
  beginDate: Date;

  @Column({ name: "end_date", type: "timestamp", nullable: false })
  endDate: Date;

  @Column({ name: "description", type: "text", nullable: false })
  description: string;

  @OneToMany(() => EventImage, (eventImage) => eventImage.eventId)
  readonly images: EventImage[];

  @OneToMany(() => FavoriteEvent, (favoriteEvent) => favoriteEvent.eventId)
  readonly favoriteList: FavoriteEvent[];

  @OneToOne(() => Game)
  @JoinColumn({ name: "game_id", referencedColumnName: "id" })
  readonly game: Game;
}
