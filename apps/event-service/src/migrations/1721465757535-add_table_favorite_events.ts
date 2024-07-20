import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableFavoriteEvents1721465757535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "favorite_events",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "account_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "event_id",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_FAVORITE_EVENTS_ACCOUNT_ID",
            columnNames: ["event_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "events",
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
