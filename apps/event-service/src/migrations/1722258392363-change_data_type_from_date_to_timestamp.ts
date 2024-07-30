import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDataTypeFromDateToTimestamp1722258392363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "begin_date" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "end_date" TYPE TIMESTAMP`);
  }

  public async down(_: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
