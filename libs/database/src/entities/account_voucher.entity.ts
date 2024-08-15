import { VoucherStatusEnum, IAccountVoucher } from "@types";
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

@Entity("accounts_vouchers")
export class AccountVoucher extends BaseEntity implements IAccountVoucher {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "account_id", type: "uuid", nullable: false })
  accountId: string;

  @Column({ name: "voucher_id", type: "uuid", nullable: false })
  voucherId: string;

  @Column({ name: "quantity", type: "int", default: 1 })
  quantity: number;

  @CreateDateColumn({ name: "assigned_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assigenedOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  @Column({ name: "status", type: "enum", enum: VoucherStatusEnum, default: VoucherStatusEnum.ACTIVE })
  status: VoucherStatusEnum;

  // Relations
  @ManyToOne(() => Voucher, (voucher) => voucher.accountVoucher)
  @JoinColumn({ name: "voucher_id", referencedColumnName: "id" })
  readonly voucher: Voucher;
}
