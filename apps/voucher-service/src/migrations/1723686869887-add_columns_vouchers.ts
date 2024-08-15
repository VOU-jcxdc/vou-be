import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsVouchers1723686869887 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("vouchers", [
      new TableColumn({
        name: "brand_id",
        type: "uuid",
        isNullable: false,
        default: "uuid_generate_v4()",
      }),
      new TableColumn({
        name: "usage_mode",
        type: "enum",
        enum: ["online", "offline"],
        isNullable: false,
        default: "'offline'",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
