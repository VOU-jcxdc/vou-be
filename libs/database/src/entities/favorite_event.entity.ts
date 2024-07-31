import { IFavoriteEvent } from "@types";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity({ name: "favorite_events" })
export class FavoriteEvent extends BaseEntity implements IFavoriteEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "account_id", type: "uuid", nullable: false })
  accountId: string;

  @Column({ name: "event_id", type: "uuid", nullable: false })
  eventId: string;

  @ManyToOne(() => Event, (event) => event.favoriteList)
  @JoinColumn({ name: "event_id", referencedColumnName: "id" })
  readonly event: Event;
}
