import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTablePlayersInfo1721294176504 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "players_info",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "gender",
            type: "enum",
            enum: ["male", "female"],
            isNullable: true,
            default: null,
          },
          {
            name: "dob",
            type: "date",
            isNullable: true,
            default: null,
          },
          {
            name: "account_id",
            type: "uuid",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_PLAYERS_INFO_ACCOUNT_ID",
            columnNames: ["account_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "accounts",
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
