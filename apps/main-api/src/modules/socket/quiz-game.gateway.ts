import { Logger } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from "@nestjs/websockets";
import { RedisService } from "@shared-modules";
import { Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WSAuthMiddleware } from "../../middlewares/socket.middware";
import { ISocketClient } from "@types";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { ConfigService } from "@nestjs/config";
import { ConfirmChannel } from "amqplib";
import { QuizgameService } from "../quizgame/quizgame.service";

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(QuizGameGateway.name);
  private channelWrapper: ChannelWrapper;
  private configService: ConfigService;
  private readonly waitingPlayerTime: number = 10; // 10 seconds
  private readonly waitingQuestionTime: number = 10; // 10 seconds
  private readonly waitingAnswerTime: number = 10; // 10 seconds
  private readonly waitingShowAnswerTime: number = 10; // 10 seconds

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly quizGameService: QuizgameService,
    configService: ConfigService
  ) {
    this.configService = configService;
  }

  async afterInit() {
    console.log("Socket server initialized");
    const middle = WSAuthMiddleware(this.jwtService);
    this.server.use(middle);
    const connection = amqp.connect([this.configService.get("RMQ_URLS")]);
    this.channelWrapper = connection.createChannel();
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertQueue("quizGameQueue", { durable: true });
      await channel.consume("quizGameQueue", async (message) => {
        if (message) {
          console.log("Message", message.content.toString());
          const { roomId } = JSON.parse(message.content.toString());
          const questions = await this.quizGameService.getQuestionsInRoomGame(roomId);
          console.log("Questions", questions);
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
            }
          }, 1000); // after 1 second, decrease 1 second

          this.prepareAndStartGame(10, numQuestion, intervalId);
        }
        channel.ack(message);
      });
    });
  }

  async handleConnection(@ConnectedSocket() client: ISocketClient, ...args: any[]) {
    try {
      const player = client.player;
      console.log("handleConnection", client.id);
      console.log("user", player);

      // Get roomId from query
      const roomId = client.handshake.query.roomId;

      // Save userId and socketId to redis
      await this.redisService.set(`quizgame-player-${player.userId}-room-${roomId}`, client.id, 3600 * 24); // 1 day
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
    this.server.emit("player-left", {
      message: "Player left",
    });
  }

  async prepareAndStartGame(timeLeft: number, numQuestion: number, intervalId: any) {
    setTimeout(async () => {
      console.log("Timeout completed");

      this.server.emit("game-start", {});
      const clientKeys = await this.redisService.keys(`quizgame-player-*-room-1234`);
      const clients = await Promise.all(
        clientKeys.map(async (key) => {
          const socketId = await this.redisService.get(key);
          return socketId;
        })
      );
      this.startGame(clients, numQuestion, intervalId);
    }, timeLeft * 1000);
  }

  async startGame(clients: string[], numQuestion: number, intervalId: any) {
    const totalWaitingTime = (this.waitingQuestionTime + this.waitingAnswerTime + this.waitingShowAnswerTime) * 1000;
    console.log("start the game");
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
  }
}
