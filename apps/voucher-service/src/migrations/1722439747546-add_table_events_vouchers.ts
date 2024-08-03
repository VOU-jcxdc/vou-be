import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddTableEventsVouchers1722439747546 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "events_vouchers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "event_id",
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
        foreignKeys: [
          {
            name: "FK_EVENTS_VOUCHERS_VOUCHER_ID",
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
