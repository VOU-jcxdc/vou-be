import { Module } from "@nestjs/common";
import { QuestionController } from "./question.controller";
import { QuestionService } from "./question.service";
import { QAModelModule } from "../model/qa-model.module";
import { RoomGameModelModule } from "../model/room-game-model.module";
import { QuestionHelper } from "./question.helper";

@Module({
  imports: [QAModelModule, RoomGameModelModule],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionHelper],
})
export class QuestionModule {}
