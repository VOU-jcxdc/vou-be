import { Module } from "@nestjs/common";
import { QuizGameGateway } from "./quiz-game.gateway";
import { RedisModule } from "@shared-modules";

@Module({
  imports: [RedisModule],
  providers: [QuizGameGateway],
  exports: [QuizGameGateway],
})
export class SocketModule {}
