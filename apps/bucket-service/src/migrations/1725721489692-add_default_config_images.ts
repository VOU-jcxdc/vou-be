import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultConfigImages1725721489692 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO buckets (id, filename, upload_status)
            VALUES
            ('143d1e47-4c69-4a5b-a8c1-0a23ddb66b4b', 'config.jpg', 'uploaded');
        `);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
