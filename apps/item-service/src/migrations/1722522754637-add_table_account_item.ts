import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableAccountItem1722522754637 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "account_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "account_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "status",
            type: "enum",
            enum: ["available", "used", "transferred"],
            isNullable: false,
            default: "'available'",
          },
          {
            name: "assigned_date",
            type: "timestamp",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "item_id",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_ACCOUNT_ITEMS_ITEM_ID",
            columnNames: ["item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "items",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
