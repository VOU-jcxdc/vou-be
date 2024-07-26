import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUploadStatusColumnBuckets1721794364110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "buckets",
      new TableColumn({
        name: "upload_status",
        type: "enum",
        enum: ["pending", "uploaded"],
        isNullable: false,
        default: "'pending'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
