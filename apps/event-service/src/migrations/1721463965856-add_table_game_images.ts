import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableGameImages1721463965856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "game_images",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "game_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "bucket_id",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_GAME_IMAGES_GAME_ID",
            columnNames: ["game_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "games",
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
