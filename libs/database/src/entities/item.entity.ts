import { IItem, ItemStatusEnum, ItemTypeEnum } from "@types";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "items" })
export class Item extends BaseEntity implements IItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ name: "image_id", type: "uuid", nullable: false })
  imageId: string;

  @Column({ name: "game_id", type: "uuid", nullable: false })
  gameId: string;

  @Column({ name: "type", type: "enum", enum: ItemTypeEnum, default: ItemTypeEnum.CRAFTING_MATERIAL, nullable: false })
  type: ItemTypeEnum;

  @Column({ name: "status", type: "enum", enum: ItemStatusEnum, default: ItemStatusEnum.ACTIVE, nullable: false })
  status: ItemStatusEnum;

  @Column({ name: "created_on", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @Column({ name: "updated_on", type: "timestamp", nullable: false, default: () => "CURRENT_TIMESTAMP" })
  updatedOn: Date;
}
