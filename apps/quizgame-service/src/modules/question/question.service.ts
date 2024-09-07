import { Injectable, Logger } from "@nestjs/common";
import { QAModel } from "../model/qa.model";
import { IQAs, RoomGameStatus } from "@types";
import { RoomGameModel } from "../model/room-game.model";
import { Types } from "mongoose";
import { QuestionHelper } from "./question.helper";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    private readonly qaModel: QAModel,
    private readonly roomGameModel: RoomGameModel,
    private readonly questionHelper: QuestionHelper
  ) {}

  async createQuestions(data: { data: IQAs[]; eventId: string }) {
    try {
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

      return this.questionHelper.buildDataResponse(roomGame._id as Types.ObjectId);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getQuestionsInEvent(eventId: string) {
    try {
      const roomGame = await this.roomGameModel.findOne({ eventId });

      if (!roomGame.QAs) return [];

      return Promise.all(
        roomGame.QAs.map((id) => {
          return this.qaModel.findById(Types.ObjectId.createFromHexString(id));
        })
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getRoomGame(eventId: string) {
    try {
      const roomGame = await this.roomGameModel.findOne({ eventId });
      return {
        id: roomGame._id,
        status: roomGame.status,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getQuestionsInRoomGame(roomId: string) {
    try {
      const roomGame = await this.roomGameModel.findById(Types.ObjectId.createFromHexString(roomId));

      if (!roomGame.QAs) return [];

      return Promise.all(
        roomGame.QAs.map((id) => {
          return this.qaModel.findById(Types.ObjectId.createFromHexString(id));
        })
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
