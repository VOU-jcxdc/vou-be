import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { RoomGameModel } from "../model/room-game.model";
import { QAModel } from "../model/qa.model";

@Injectable()
export class ParserHelper {
  constructor(private readonly roomGameModel: RoomGameModel, private readonly qaModel: QAModel) {}

  async buildDataResponse(roomGameId: Types.ObjectId) {
    const roomGame = await this.roomGameModel.findById(roomGameId);
    const qaList = await Promise.all(
      roomGame.QAs.map(async (id) => {
        return this.qaModel.findById(Types.ObjectId.createFromHexString(id));
      })
    );

    return {
      ...roomGame.toObject(),
      QAs: qaList,
    };
  }
}
