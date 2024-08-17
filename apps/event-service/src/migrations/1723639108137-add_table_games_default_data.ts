import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableGamesDefaultData1723639108137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO games (id, name, type, exchange_status, instruction)
      VALUES 
        (
          'd463bd0b-99ae-4070-b4e4-5d390ec3211c', 
          'Real-time Quiz Game', 
          'realtime_quiz_game', 
          false, 
          'Objective: Answer as many questions correctly within the given time limit.\\nGameplay:\\n1. Players join the game and wait for the quiz to start.\\n2. Questions are displayed one at a time, and players must select the correct answer from multiple choices.\\n3. Points are awarded for each correct answer, and the faster the response, the more points are earned.\\n4. The game continues until the time limit is reached or all questions are answered.\\n5. The player with the highest score at the end of the game wins.\\nRules:\\n1. No cheating or using external help.\\n2. Players must answer within the time limit for each question.'
        ),
        (
          '8340911c-a33e-4d59-9669-093fb2db46cd', 
          'Shake Game', 
          'shake_game', 
          true, 
          'Objective: Shake your device as many times as possible within the given time limit.\\nGameplay:\\n1. Players join the game and wait for the shake challenge to start.\\n2. Once the game starts, players must shake their devices vigorously.\\n3. The game will random the prize for the user.\\nRules:\\n1. Players must hold their devices securely to avoid dropping them.\\n2. No external devices or tools are allowed to assist in shaking.'
        );
    `);
  }

  public async down(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
