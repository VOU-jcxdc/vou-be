import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsCreateUpdateTime1724395959964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("buckets", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
