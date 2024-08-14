import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBucketsDefaultData1723648181024 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO buckets (id, filename, upload_status)
      VALUES 
        (
          'a24be2e9-5588-4f6a-95ab-1ad198d65cc1', 
          'realtime_quiz_game_1.jpg', 
          'uploaded'
        ),
        (
          '17de0331-a1a6-4308-bece-fc5a4a2d5c22', 
          'shake_game_1.jpg', 
          'uploaded'
        );
    `);
  }

  public async down(_: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
