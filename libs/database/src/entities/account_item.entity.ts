import { AccountItemStatusEnum, IAccountItem } from "@types";
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

@Entity({ name: "account_items" })
export class AccountItem extends BaseEntity implements IAccountItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "account_id", type: "uuid", nullable: false })
  accountId: string;

  @Column({
    name: "status",
    type: "enum",
    enum: AccountItemStatusEnum,
    default: AccountItemStatusEnum.AVAILABLE,
    nullable: false,
  })
  status: AccountItemStatusEnum;

  @CreateDateColumn({ name: "assigned_date", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  assignedDate: Date;

  @Column({ name: "item_id", type: "uuid", nullable: false })
  itemId: string;

  @Column({ name: "quantity", type: "int", nullable: false })
  quantity: number;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;

  // Relations
  @OneToOne(() => Item)
  @JoinColumn({ name: "item_id", referencedColumnName: "id" })
  readonly item: Item;
}
