import { GiftStatusEnum, IGift } from "@types";
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
import { Item } from "./item.entity";

@Entity({ name: "gifts" })
export class Gift extends BaseEntity implements IGift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "sender_id", type: "uuid", nullable: false })
  senderId: string;

  @Column({ name: "receiver_id", type: "uuid", nullable: false })
  receiverId: string;

  @Column({ name: "event_id", type: "uuid", nullable: false })
  eventId: string;

  @CreateDateColumn({ name: "send_date", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  sendDate: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @Column({ name: "quantity", type: "int", nullable: false })
  quantity: number;

  @Column({ name: "status", type: "enum", enum: GiftStatusEnum })
  status: GiftStatusEnum;

  @Column({ name: "item_id", type: "uuid", nullable: false })
  itemId: string;

  @OneToOne(() => Item)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  readonly item: Item;
}
