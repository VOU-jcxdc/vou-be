import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsGeneratedColumnIdTableFavoriteEvents1722313718577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "favorite_events"
        ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
