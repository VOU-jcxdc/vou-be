import { IBucket, UploadStatusEnum } from "@types";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "buckets" })
export class Bucket extends BaseEntity implements IBucket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "filename", type: "varchar", length: 255, nullable: false })
  filename: string;

  @Column({ name: "upload_status", type: "enum", enum: UploadStatusEnum, default: UploadStatusEnum.PENDING })
  uploadStatus: string;

  @CreateDateColumn({ name: "created_on", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdOn: Date;

  @UpdateDateColumn({
    name: "updated_on",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedOn: Date;
}
