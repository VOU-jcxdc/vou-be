import { IFavoriteEvent } from "@types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Event } from "./event.entity";

@Entity({ name: "favorite_events" })
export class FavoriteEvent extends BaseEntity implements IFavoriteEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "account_id", type: "uuid", nullable: false })
  accountId: string;

  @Column({ name: "event_id", type: "uuid", nullable: false })
  eventId: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @ManyToOne(() => Event, (event) => event.favoriteList)
  @JoinColumn({ name: "event_id", referencedColumnName: "id" })
  readonly event: Event;
}
