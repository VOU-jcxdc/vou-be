import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableEventImages1721465048633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "event_images",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "event_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "bucket_id",
            type: "varchar",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["event_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "events",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(_: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
