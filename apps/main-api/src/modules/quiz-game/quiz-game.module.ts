import { Module } from "@nestjs/common";
<<<<<<< HEAD
import { QuizGameService } from "./quiz-game.service";
import { QuizGameController } from "./quiz-game.controller";

@Module({
  providers: [QuizGameService],
  controllers: [QuizGameController],
=======
import { SocketModule } from "../socket/socket.module";
import { QuizGameService } from "./quiz-game.service";

@Module({
  imports: [SocketModule],
  providers: [QuizGameService],
>>>>>>> f01da73 (feat(vou-84): setup socket gateway)
})
export class QuizGameModule {}
