import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableGameImagesDefaultData1723649327651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO game_images (id, game_id, bucket_id)
        VALUES
            (
                uuid_generate_v4(),
                'd463bd0b-99ae-4070-b4e4-5d390ec3211c',
                'a24be2e9-5588-4f6a-95ab-1ad198d65cc1'
            ),
            (
                uuid_generate_v4(),
                '8340911c-a33e-4d59-9669-093fb2db46cd',
                '17de0331-a1a6-4308-bece-fc5a4a2d5c22'
            );
    `);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
