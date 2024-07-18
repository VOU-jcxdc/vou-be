import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableAccounts1721294083719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "accounts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "username",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "phone",
            type: "varchar",
            length: "16",
            isUnique: true,
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive", "suspended", "blocked", "deleted"],
            default: "'inactive'",
          },
          {
            name: "role",
            type: "enum",
            enum: ["admin", "brand", "player"],
            default: "'player'",
          },
          {
            name: "bucket_id",
            type: "uuid",
            isNullable: true,
            default: null,
          },
          {
            name: "created_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_on",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "created_by",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "updated_by",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: "FK_ACCOUNTS_BUCKET",
            columnNames: ["bucket_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "buckets",
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
