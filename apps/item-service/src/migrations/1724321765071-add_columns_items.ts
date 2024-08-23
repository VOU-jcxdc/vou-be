import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsItems1724321765071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("items", [
      new TableColumn({
        name: "quantity",
        type: "int",
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
