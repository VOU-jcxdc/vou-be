import { IBucket, UploadStatusEnum } from "@types";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "buckets" })
export class Bucket extends BaseEntity implements IBucket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "filename", type: "varchar", length: 255, nullable: false })
  filename: string;

  @Column({ name: "upload_status", type: "varchar", length: 255, nullable: false, default: UploadStatusEnum.PENDING })
  uploadStatus: string;
}
