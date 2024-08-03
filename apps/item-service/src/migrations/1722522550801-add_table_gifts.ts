import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableGifts1722522550801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "gifts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "sender_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "receiver_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "game_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "send_date",
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
            name: "FK_GIFTS_ITEM_ID",
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
