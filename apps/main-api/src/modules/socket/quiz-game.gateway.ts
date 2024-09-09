import { Inject, Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { RedisService } from "@shared-modules";
import { Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WSAuthMiddleware } from "../../middlewares/socket.middware";
import { ISocketClient, RoomGameStatus } from "@types";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfigService } from "@nestjs/config";
import { ConfirmChannel } from "amqplib";
import { QuizgameService } from "../quizgame/quizgame.service";
import axios from "axios";
import { ClientProxy } from "@nestjs/microservices";

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(QuizGameGateway.name);
  private channelWrapper: ChannelWrapper;
  private configService: ConfigService;
  private readonly waitingPlayerTime: number = 20; // 20 seconds
  private readonly waitingQuestionTime: number = 10; // 10 seconds
  private readonly waitingAnswerTime: number = 10; // 10 seconds
  private readonly waitingShowAnswerTime: number = 10; // 10 seconds

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly quizGameService: QuizgameService,
    configService: ConfigService,
    @Inject("QUIZGAME_SERVICE") private readonly quizGameClient: ClientProxy
  ) {
    this.configService = configService;
  }

  async afterInit() {
    const middle = WSAuthMiddleware(this.jwtService);
    this.server.use(middle);
    const connection = amqp.connect([this.configService.get("RMQ_URLS")]);
    this.channelWrapper = connection.createChannel();
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertQueue("roomGameQueue", { durable: true });
      await channel.consume("roomGameQueue", async (message) => {
        if (message) {
          const { roomId } = JSON.parse(message.content.toString());
          this.quizGameClient.emit(
            { method: "PUT", path: "/quiz-game/room-game/:roomId" },
            { roomId, status: RoomGameStatus.WAITING, players: [], action: "" }
          );
          const questions = await this.quizGameService.getQuestionsInRoomGame(roomId);

          const getAIEndpoint = this.configService.get<string>("AI_ENDPOINT");

          // Send questions to AI without waiting for response
          for (let i = 0; i < questions.length; i++) {
            axios.post(getAIEndpoint + "/api/videos", {
              id: roomId + "-" + i.toString(),
              text: questions[i].question + " " + questions[i].options.join(";"),
            });
          }

          const numQuestion = questions.length;
          this.server.emit("waiting-players", {
            message: "Waiting for players",
          });
          let waitingPlayerTimeLeft = this.waitingPlayerTime; // Time left in seconds

          const intervalId = setInterval(() => {
            waitingPlayerTimeLeft--;
            console.log(`Time left: ${waitingPlayerTimeLeft} seconds`);

            if (waitingPlayerTimeLeft <= 0) {
              clearInterval(intervalId);
              this.prepareAndStartGame(waitingPlayerTimeLeft, roomId, numQuestion, intervalId);
            }
          }, 1000); // after 1 second, decrease 1 second
        }
        channel.ack(message);
      });
    });
  }

  async handleConnection(@ConnectedSocket() client: ISocketClient, ...args: any[]) {
    try {
      const player = client.player;
      // Get roomId from query
      const roomId = client.handshake.query.roomId;

      const isAvailable = await this.quizGameService.checkAvailableRoomGame(roomId as string);
      if (!isAvailable) {
        this.server.emit("room-full", {
          message: "Room is full",
        });
        client.disconnect();
        return;
      }
      // Save userId and socketId to redis
      await this.redisService.set(`quizgame-player-${player.userId}-room-${roomId}`, client.id, 3600 * 24); // 1 day
      this.quizGameClient.emit(
        { method: "PUT", path: "/quiz-game/room-game/:roomId" },
        { roomId, status: RoomGameStatus.WAITING, players: [player.userId], action: "add-player" }
      );
      this.server.emit("player-joined", {
        message: "New player joined",
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: ISocketClient) {
    const player = client.player;
    // Get roomId from query
    const roomId = client.handshake.query.roomId;

    // Remove userId and socketId from redis
    await this.redisService.del(`quizgame-player-${player.userId}-room-${roomId}`);
    this.quizGameClient.emit(
      { method: "PUT", path: "/quiz-game/room-game/:roomId" },
      { roomId, status: RoomGameStatus.WAITING, players: [player.userId], action: "remove-player" }
    );
    this.server.emit("player-left", {
      message: "Player left",
    });
  }

  async prepareAndStartGame(timeLeft: number, roomId: string, numQuestion: number, intervalId: any) {
    setTimeout(async () => {
      console.log("Timeout completed");

      this.quizGameClient.emit(
        { method: "PUT", path: "/quiz-game/room-game/:roomId" },
        { roomId, status: RoomGameStatus.ONGOING, players: [], action: "" }
      );

      const clientKeys = await this.redisService.keys(`quizgame-player-*-room-${roomId}`);
      const clients = await Promise.all(
        clientKeys.map(async (key) => {
          const socketId = await this.redisService.get(key);
          return socketId;
        })
      );
      this.startGame(clients, roomId, numQuestion, intervalId);
    }, timeLeft * 1000);
  }

  async startGame(clients: string[], roomId: string, numQuestion: number, intervalId: any) {
    const totalWaitingTime = (this.waitingQuestionTime + this.waitingAnswerTime + this.waitingShowAnswerTime) * 1000;
    for (let i = 0; i < numQuestion; i++) {
      setTimeout(() => {
        this.server.to(clients).emit("start-question", {
          noQa: i,
        });
      }, i * totalWaitingTime);

      setTimeout(() => {
        this.server.to(clients).emit("answer-question", {
          message: `Answer question ${i + 1}`,
        });
      }, i * totalWaitingTime + this.waitingQuestionTime * 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        this.server.to(clients).emit("show-answer", {
          message: `Show answer ${i + 1}`,
        });
      }, i * totalWaitingTime + (this.waitingQuestionTime + this.waitingAnswerTime) * 1000);
    }

    setTimeout(() => {
      this.finishGame(roomId);
    }, numQuestion * totalWaitingTime);
  }

  async finishGame(roomId: string) {
    const playersRanking = await this.quizGameService.getPlayersRanking(roomId);
    console.log("Players ranking", playersRanking);
    this.server.emit("game-finished", {
      message: "Game finished",
      playersRanking,
    });
  }

  @SubscribeMessage("save-score")
  async saveScore(@ConnectedSocket() client: ISocketClient, @MessageBody() data: { roomId: string; score: number }) {
    const player = client.player;
    const { roomId, score } = data;
    this.quizGameClient.emit(
      { method: "PUT", path: "/quiz-game/room-game/:roomId/players-score" },
      { roomId, playerId: player.userId, score }
    );
    this.server.emit("player-score", {
      message: `Player ${player.userId} scored ${score}`,
    });
  }
}
