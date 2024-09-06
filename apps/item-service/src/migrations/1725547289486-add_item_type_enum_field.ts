import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddItemTypeEnumField1725547289486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "items",
      "type",
      new TableColumn({
        name: "type",
        type: "enum",
        enum: ["crafting_material", "config"],
        default: "'crafting_material'",
        isNullable: false,
      })
    );
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
