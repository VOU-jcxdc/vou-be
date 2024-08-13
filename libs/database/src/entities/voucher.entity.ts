import { IVoucher, VoucherStatus, VoucherType } from "@types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AccountVoucher } from "./account_voucher.entity";
import { EventVoucher } from "./event_voucher.entity";

@Entity("vouchers")
export class Voucher extends BaseEntity implements IVoucher {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ name: "description", type: "text", nullable: false })
  description: string;

  @Column({ name: "code", type: "varchar", length: 50, nullable: false })
  code: string;

  @Column({ name: "type", type: "enum", enum: VoucherType, default: VoucherType.AMOUNT })
  type: VoucherType;

  @Column({ name: "value", type: "int", default: 0 })
  value: number;

  @Column({ name: "status", type: "enum", enum: VoucherStatus, default: VoucherStatus.ACTIVE })
  status: VoucherStatus;

  @Column({ name: "duration", type: "int", nullable: true })
  duration: number;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  //relations
  @OneToMany(() => AccountVoucher, (accountVoucher) => accountVoucher.voucher)
  readonly accountVoucher: AccountVoucher[];

  @OneToMany(() => EventVoucher, (eventVoucher) => eventVoucher.voucher)
  readonly eventVoucher: EventVoucher[];
}
