import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableGames1721463673509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: "games",
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
            name: "type",
            type: "enum",
            enum: ["realtime_quiz_game", "shake_game"],
            isNullable: false,
          },
          {
            name: "exchange_status",
            type: "boolean",
            default: false,
            isNullable: false,
          },
          {
            name: "instruction",
            type: "text",
            isNullable: false,
          },
        ],
      })
    );
  }

  public async down(_: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
