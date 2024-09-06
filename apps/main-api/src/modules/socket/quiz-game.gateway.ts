import { Logger } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
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

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(QuizGameGateway.name);
  private readonly mockquestions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "Marseille", "Lyon", "Toulouse"],
      answer: 1,
    },
    {
      question: "What is the capital of Italy?",
      options: ["Milan", "Rome", "Venice", "Florence"],
      answer: 2,
    },
    {
      question: "What is the capital of Germany?",
      options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
      answer: 0,
    },
    {
      question: "What is the capital of Spain?",
      options: ["Madrid", "Barcelona", "Valencia", "Seville"],
      answer: 0,
    },
  ];

  private channelWrapper: ChannelWrapper;
  private configService: ConfigService;

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
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
          //const { eventId } = JSON.parse(message.content.toString());
          //const questions = await this.getQuestions(eventId);
          const numQuestion = this.mockquestions.length;
          this.server.emit("waiting-players", {
            message: "Waiting for players",
            questions: this.mockquestions,
          });
          let timeLeft = 10; // Time left in seconds

          const intervalId = setInterval(() => {
            timeLeft--;
            console.log(`Time left: ${timeLeft} seconds`);

            if (timeLeft <= 0) {
              clearInterval(intervalId);
            }
          }, 1000);

          this.prepareAndStartGame(10, numQuestion, intervalId);
        }
        channel.ack(message);
      });
    });
  }

  async handleConnection(@ConnectedSocket() client: ISocketClient, ...args: any[]) {
    const player = client.player;
    console.log("handleConnection", client.id);
    console.log("user", player);

    // Get eventId from query
    const eventId = client.handshake.query.eventId;

    // Save userId and socketId to redis
    await this.redisService.set(`quizgame-player-${player.userId}-event-${eventId}`, client.id, 3600 * 24); // 1 day
    this.server.emit("player-joined", {
      message: "New player joined",
    });
  }

  async handleDisconnect(@ConnectedSocket() client: ISocketClient) {
    const player = client.player;
    // Get eventId from query
    const eventId = client.handshake.query.eventId;

    // Remove userId and socketId from redis
    await this.redisService.del(`quizgame-player-${player.userId}-event-${eventId}`);
    this.server.emit("player-left", {
      message: "Player left",
    });
  }

  async prepareAndStartGame(timeLeft: number, numQuestion: number, intervalId: any) {
    setTimeout(async () => {
      console.log("Timeout completed");

      this.server.emit("game-start", {});
      const clientKeys = await this.redisService.keys(`quizgame-player-*-event-1234`);
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
    console.log("start the game");
    for (let i = 0; i < numQuestion; i++) {
      setTimeout(() => {
        this.server.to(clients).emit("start-question", {
          noQa: i,
        });
      }, i * 20000);

      setTimeout(() => {
        clearInterval(intervalId);
        this.server.to(clients).emit("end-question", {
          message: `End question ${i + 1}`,
        });
      }, i * 20000 + 10000);
    }
  }

  async getQuestions(eventId: string) {
    // Get questions from microservice
    return [];
  }
}
