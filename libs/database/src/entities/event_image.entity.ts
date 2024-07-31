import { IEventImage } from "@types";
import { BaseEntity, Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity({ name: "event_images" })
export class EventImage extends BaseEntity implements IEventImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "event_id", type: "uuid", nullable: false })
  eventId: string;

  @Column({ name: "bucket_id", type: "uuid", nullable: false })
  bucketId: string;

  @ManyToOne(() => Event, (event) => event.images)
  @JoinColumn({ name: "event_id", referencedColumnName: "id" })
  event: Event;
}
