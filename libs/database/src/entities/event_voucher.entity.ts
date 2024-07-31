import { IEventVoucher } from "@types";
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
import { Voucher } from "./voucher.entity";

@Entity("events_vouchers")
export class EventVoucher extends BaseEntity implements IEventVoucher {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "event_id", type: "uuid", nullable: false })
  eventId: string;

  @Column({ name: "voucher_id", type: "uuid", nullable: false })
  voucherId: string;

  @Column({ name: "quantity", type: "int", default: 1 })
  quantity: number;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @ManyToOne(() => Voucher, (voucher) => voucher.eventVoucher)
  @JoinColumn({ name: "voucher_id", referencedColumnName: "id" })
  readonly voucher: Voucher;
}
