import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsAccountsItems1724322072832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("account_items", [
      new TableColumn({
        name: "quantity",
        type: "int",
        isNullable: false,
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
