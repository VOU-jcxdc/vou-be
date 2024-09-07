import { Module } from "@nestjs/common";
import { QuizgameController } from "./quizgame.controller";
import { QuizgameService } from "./quizgame.service";
import { ClientProxyModule } from "@shared-modules";

@Module({
  imports: [ClientProxyModule],
  controllers: [QuizgameController],
  providers: [QuizgameService],
  exports: [QuizgameService],
})
export class QuizgameModule {}
