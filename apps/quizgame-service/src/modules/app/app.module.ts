import { Module } from "@nestjs/common";
import { QuestionModule } from "../question/question.module";
import { ConfigModule } from "@nestjs/config";
import { RoomGameModule } from "../room-game/room-game.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), QuestionModule, RoomGameModule],
})
export class AppModule {}
