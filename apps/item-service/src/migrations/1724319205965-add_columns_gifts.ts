import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsGifts1724319205965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("gifts", [
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "quantity",
        type: "int",
      }),
      new TableColumn({
        name: "status",
        type: "enum",
        enum: ["requested", "rejected", "accepted"],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
