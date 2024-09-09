import { Injectable, Logger } from "@nestjs/common";
import { QAModel } from "../model/qa.model";
import { IQAs, RoomGameStatus } from "@types";
import { RoomGameModel } from "../model/room-game.model";
import { Types } from "mongoose";
import { RpcException } from "@nestjs/microservices";
import _ from "lodash";

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(private readonly qaModel: QAModel, private readonly roomGameModel: RoomGameModel) {}

  async createQuestions(data: { data: IQAs[]; eventId: string }) {
    try {
      return this.qaModel.saveMany(data.data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async getQuestionsInEvent(eventId: string) {
    try {
      return this.qaModel.find({ eventId });
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

  async createRoomGame(eventId: string) {
    try {
      const qas = await this.qaModel.find({ eventId });
      if (_.isNil(qas) || qas.length === 0) {
        throw new RpcException("Cannot create room game without questions");
      }
      return this.roomGameModel.upsert(
        {
          eventId,
        },
        {
          QAs: qas.map((it) => {
            return String(it._id);
          }),
          players: [],
          status: RoomGameStatus.PLANNING,
          eventId: eventId,
        }
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateRoomGame(roomId: string, data: { status: RoomGameStatus; players: string[] }) {
    try {
      return this.roomGameModel.updateOne({ _id: Types.ObjectId.createFromHexString(roomId) }, data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
