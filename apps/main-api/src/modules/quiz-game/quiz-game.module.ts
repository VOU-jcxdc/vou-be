import { Module } from "@nestjs/common";
import { SocketModule } from "../socket/socket.module";
import { QuizGameService } from "./quiz-game.service";

@Module({
  imports: [SocketModule],
  providers: [QuizGameService],
})
export class QuizGameModule {}
