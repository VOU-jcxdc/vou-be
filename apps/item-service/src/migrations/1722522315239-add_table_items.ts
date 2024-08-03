import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableItems1722522315239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "image_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "game_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "type",
            type: "enum",
            enum: ["crafting_material"],
            default: "'crafting_material'",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive"],
            default: "'active'",
            isNullable: false,
          },
          {
            name: "created_on",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_on",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
