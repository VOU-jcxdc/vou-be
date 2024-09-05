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

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(QuizGameGateway.name);

  constructor(private readonly redisService: RedisService, private readonly jwtService: JwtService) {}

  async afterInit() {
    const middle = WSAuthMiddleware(this.jwtService);
    this.server.use(middle);
  }

  async handleConnection(@ConnectedSocket() client: ISocketClient, ...args: any[]) {
    // const player = client.player;
    // await this.redisService.set(`player-${player.userId}`, client.id, 3600 * 24); // 1 day

    // console.log("handleConnection", client.id);
    // console.log("user", player);

    // Get eventId from query
    const eventId = client.handshake.query.eventId;

    // Save userId and socketId to redis
    await this.redisService.set(`quizgame-player-${client.player.userId}-event-${eventId}`, client.id, 3600 * 24); // 1 day
  }

  async handleDisconnect(@ConnectedSocket() client: ISocketClient) {
    // const player = client.player;
    // this.redisService.del(`player-${player.userId}`);

    // Get eventId from query
    const eventId = client.handshake.query.eventId;

    // Remove userId and socketId from redis
    await this.redisService.del(`quizgame-player-${client.player.userId}-event-${eventId}`);
  }

  @SubscribeMessage("start-game")
  async handleMessage(@MessageBody() payload: string) {
    // console.log("socket", client.id);
    // console.log("player", client.player);
    // console.log("join-game", payload);
    // this.server.emit("game-joined", {
    //   message: "I am new player",
    // });
    // return "Hello world!";

    // Get client joined game with eventId = 1234 from redis -> Pattern 'quizgame-player-{userId}-event-{eventId}'
    // userId must replace with regex
    const clientKeys = await this.redisService.keys(`quizgame-player-*-event-1234`);
    const clients = await Promise.all(
      clientKeys.map(async (key) => {
        const socketId = await this.redisService.get(key);
        return socketId;
      })
    );
    console.log("clients", clients);

    // Start game
    for (const client of clients) {
      this.server.to(client).emit("game-start", {
        message: "Game started",
      });
    }

    const mockquestions = [
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
    ];

    // Send questions to players each 10 seconds
    let i = 0;
    const interval = setInterval(() => {
      console.log("Question", mockquestions[i]);
      for (const client of clients) this.server.to(client).emit("questions", mockquestions[i]);
      i++;
      if (i >= mockquestions.length) {
        clearInterval(interval);
      }
    }, 10000);
  }
}
