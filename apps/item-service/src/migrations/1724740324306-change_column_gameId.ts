import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnGameId1724740324306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn("gifts", "game_id", "event_id");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
