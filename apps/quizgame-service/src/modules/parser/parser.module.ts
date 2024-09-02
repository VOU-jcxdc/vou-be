import { Module } from "@nestjs/common";
import { ParserController } from "./parser.controller";
import { ParserService } from "./parser.service";
import { QAModelModule } from "../model/qa-model.module";
import { RoomGameModelModule } from "../model/room-game-model.module";
import { ParserHelper } from "./parser.helper";

@Module({
  imports: [QAModelModule, RoomGameModelModule],
  controllers: [ParserController],
  providers: [ParserService, ParserHelper],
})
export class ParserModule {}
