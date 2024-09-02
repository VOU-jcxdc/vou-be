import { Injectable } from "@nestjs/common";
import { QAModel } from "../model/qa.model";
import { IQAs, RoomGameStatus } from "@types";
import { RoomGameModel } from "../model/room-game.model";
import { Types } from "mongoose";
import { ParserHelper } from "./parser.helper";

@Injectable()
export class ParserService {
  constructor(
    private readonly qaModel: QAModel,
    private readonly roomGameModel: RoomGameModel,
    private readonly parserHelper: ParserHelper
  ) {}

  async createQuestions(data: { data: IQAs[]; eventId: string }) {
    const qas = await this.qaModel.saveMany(data.data);
    const roomGame = await this.roomGameModel.upsert(
      {
        eventId: data.eventId,
      },
      {
        QAs: qas.map((it) => {
          return String(it._id);
        }),
        players: [],
        status: RoomGameStatus.PLANNING,
        eventId: data.eventId,
      }
    );

    return this.parserHelper.buildDataResponse(roomGame._id as Types.ObjectId);
  }

  async getQuestionsInEvent(eventId: string) {
    const roomGame = await this.roomGameModel.findOne({ eventId });

    if (!roomGame.QAs) return [];

    return Promise.all(
      roomGame.QAs.map((id) => {
        return this.qaModel.findById(Types.ObjectId.createFromHexString(id));
      })
    );
  }
}