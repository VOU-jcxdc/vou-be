import { Injectable, Logger } from "@nestjs/common";
import { RoomGameModel } from "../model/room-game.model";
import { RpcException } from "@nestjs/microservices";
import _ from "lodash";
import { IPlayerScore, RoomGameStatus } from "@types";
import { Types } from "mongoose";
import { QAModel } from "../model/qa.model";
import { RabbitMqService } from "@shared-modules";
import { QARecordModel } from "../model/qa-record.model";

@Injectable()
export class RoomGameService {
  private readonly logger = new Logger(RoomGameService.name);
  constructor(
    private readonly roomGameModel: RoomGameModel,
    private readonly qaModel: QAModel,
    private readonly qaRecordModel: QARecordModel,
    private readonly rabbitMqService: RabbitMqService
  ) {}

  async getRoomGame(eventId: string) {
    try {
      const roomGame = await this.roomGameModel.findOne({ eventId });
      if (_.isNil(roomGame)) {
        return null;
      }
      return {
        id: roomGame._id,
        status: roomGame.status,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async checkAvailableRoomGame(roomId: string) {
    try {
      const roomGame = await this.roomGameModel.findById(Types.ObjectId.createFromHexString(roomId));
      if (_.isNil(roomGame)) {
        throw new RpcException("Room game not found");
      }
      return roomGame.status === RoomGameStatus.WAITING && roomGame.players.length < 6;
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
      const roomGame = await this.roomGameModel.upsert(
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

      await this.qaRecordModel.save({ roomId: String(roomGame._id), playerScore: [] });

      // Publish to quizgame socket games
      this.rabbitMqService.publishToQueue("roomGameQueue", {
        roomId: roomGame._id,
      });

      return {
        id: roomGame._id,
        status: roomGame.status,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async updateRoomGame(roomId: string, data: { status: RoomGameStatus; players: string[]; action: string }) {
    try {
      const existingRoomGame = await this.roomGameModel.findById(Types.ObjectId.createFromHexString(roomId));
      if (_.isNil(existingRoomGame)) {
        throw new RpcException("Room game not found");
      }
      let players = existingRoomGame.players;
      if (data.players.length > 0) {
        if (data.action === "add-player") {
          if (existingRoomGame.status !== RoomGameStatus.WAITING) {
            throw new RpcException("Cannot join room game");
          }
          players = _.union(players, data.players);
        } else {
          players = _.difference(players, data.players);
        }
      }
      await this.roomGameModel.updateOne(
        { _id: roomId },
        {
          status: data.status,
          players: players,
        }
      );

      const playerDefaultScore: IPlayerScore[] = data.players.map((player) => ({
        userId: player,
        score: 0,
      }));
      await this.qaRecordModel.updateOne({ roomId }, { playerScore: playerDefaultScore });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async upsertPlayerScore(roomId: string, playerId: string, score: number) {
    try {
      const existingRoomGameRecord = await this.qaRecordModel.findOne({ roomId });
      const currentPlayerScore = existingRoomGameRecord.playerScore.find((it: IPlayerScore) => it.userId === playerId);

      if (_.isNil(currentPlayerScore)) {
        await this.qaRecordModel.updateOne({ roomId }, { $push: { playerScore: { userId: playerId, score } } });
      } else {
        await this.qaRecordModel.updateOne(
          { roomId, "playerScore.userId": playerId },
          { $set: { "playerScore.$.score": score } }
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async rankingPlayers(roomId: string) {
    try {
      const existingRoomGameRecord = await this.qaRecordModel.findOne({ roomId });
      if (_.isNil(existingRoomGameRecord)) {
        throw new RpcException("Room game record not found");
      }

      const playerScores = existingRoomGameRecord.playerScore;
      const sortedPlayers = _.orderBy(playerScores, ["score"], ["desc"]);
      return sortedPlayers;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
