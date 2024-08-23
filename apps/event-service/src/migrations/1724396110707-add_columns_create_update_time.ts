import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddColumnsCreateUpdateTime1724396110707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns("events", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
    ]);

    await queryRunner.addColumns("games", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
    ]);

    await queryRunner.addColumns("game_images", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
    ]);

    await queryRunner.addColumns("event_images", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
    ]);

    await queryRunner.addColumns("favorite_events", [
      new TableColumn({
        name: "created_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
      }),
      new TableColumn({
        name: "updated_on",
        type: "timestamp",
        default: "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
