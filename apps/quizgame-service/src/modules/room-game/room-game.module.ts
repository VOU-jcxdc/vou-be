import { Module } from "@nestjs/common";
import { RoomGameController } from "./room-game.controller";
import { RoomGameService } from "./room-game.service";
import { RabbitmqModule } from "@shared-modules";
import { RoomGameModelModule } from "../model/room-game-model.module";
import { QAModelModule } from "../model/qa-model.module";
import { QaRecordModelModule } from "../model/qa-record-model.module";
@Module({
  imports: [RabbitmqModule, RoomGameModelModule, QAModelModule, QaRecordModelModule],
  controllers: [RoomGameController],
  providers: [RoomGameService],
})
export class RoomGameModule {}
