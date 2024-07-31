import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableAccountsVouchers1722439375759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "accounts_vouchers",
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
            name: "voucher_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "int",
            default: 1,
          },
          {
            name: "assigned_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_on",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive", "expired"],
            default: "'active'",
          },
        ],
        foreignKeys: [
          {
            name: "FK_ACCOUNTS_VOUCHERS_VOUCHER_ID",
            columnNames: ["voucher_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "vouchers",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
