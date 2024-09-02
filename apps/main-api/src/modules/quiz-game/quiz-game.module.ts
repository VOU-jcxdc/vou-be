import { Module } from "@nestjs/common";
import { QuizGameService } from "./quiz-game.service";
import { QuizGameController } from "./quiz-game.controller";

@Module({
  providers: [QuizGameService],
  controllers: [QuizGameController],
})
export class QuizGameModule {}
