import { IGift } from "@types";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity({ name: "gifts" })
export class Gift extends BaseEntity implements IGift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "sender_id", type: "uuid", nullable: false })
  senderId: string;

  @Column({ name: "receiver_id", type: "uuid", nullable: false })
  receiverId: string;

  @Column({ name: "game_id", type: "uuid", nullable: false })
  gameId: string;

  @Column({ name: "send_date", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  sendDate: Date;

  @Column({ name: "item_id", type: "uuid", nullable: false })
  itemId: string;

  @OneToOne(() => Item)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  readonly item: Item;
}
