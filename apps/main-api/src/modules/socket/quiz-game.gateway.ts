<<<<<<< HEAD
import { Logger } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { RedisService } from "@shared-modules";
import { Server } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { WSAuthMiddleware } from "../../middlewares/socket.middware";

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

  async handleConnection(client: any, ...args: any[]) {
    const player = client.player;
    await this.redisService.set(`player-${player.userId}`, client.id, 3600 * 24); // 1 day
    console.log("handleConnection", client.id);
    console.log("user", player);
  }

  async handleDisconnect(client: any) {
    const player = client.player;
    this.redisService.del(`player-${player.userId}`);
  }

  @SubscribeMessage("join-game")
  handleMessage(@MessageBody() payload: string): string {
    console.log("join-game", payload);
    this.server.emit("game-joined", {
      message: "I am new player",
    });
=======
import { Logger, OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnModuleInit {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(QuizGameGateway.name);

  onModuleInit() {
    this.server.on("connection", (socket) => {
      this.logger.log(`Client connected: ${socket.id}`);
    });
  }

  @SubscribeMessage("join-game")
  handleMessage(client: any, payload: any): string {
    console.log("join-game", payload);
>>>>>>> f01da73 (feat(vou-84): setup socket gateway)
    return "Hello world!";
  }
}
