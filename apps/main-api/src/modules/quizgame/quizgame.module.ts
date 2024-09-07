import { Module } from "@nestjs/common";
import { QuizgameController } from "./quizgame.controller";
import { QuizgameService } from "./quizgame.service";
import { ClientProxyModule } from "@shared-modules";
import { CsvModule } from "nest-csv-parser";

@Module({
  imports: [CsvModule, ClientProxyModule],
  controllers: [QuizgameController],
  providers: [QuizgameService],
  exports: [QuizgameService],
})
export class QuizgameModule {}
