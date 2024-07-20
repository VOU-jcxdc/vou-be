import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableEvents1721464502878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "events",
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
            name: "game_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "brand_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "begin_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "end_date",
            type: "date",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_EVENTS_GAME_ID",
            columnNames: ["game_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "games",
            onDelete: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
