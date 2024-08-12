import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableVouchers1722439112371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "vouchers",
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
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "type",
            type: "enum",
            enum: ["amount", "rate"],
            default: "'amount'",
          },
          {
            name: "value",
            type: "int",
            default: 0,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive", "expired"],
            default: "'active'",
          },
          {
            name: "exp",
            type: "timestamp",
            isNullable: true,
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
