import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsCreateUpdateTime1724396851067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("brands_info", [
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

    await queryRunner.addColumns("players_info", [
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
