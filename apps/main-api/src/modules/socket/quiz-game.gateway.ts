import { Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { RedisService } from "@shared-modules";
import { Server } from "socket.io";

@WebSocketGateway({ namespace: "quiz-game" })
export class QuizGameGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(QuizGameGateway.name);

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.server.on("connection", async (socket) => {
      const playerId = socket.handshake.query.playerId;
      this.logger.log(`Client ${playerId} connected: ${socket.id}`);
      await this.redisService.set(`player-${playerId}`, socket.id, 3600 * 24); // 1 day

      // Listen for the disconnect event on this socket
      socket.on("disconnect", async () => {
        this.logger.log(`Client ${playerId} disconnected: ${socket.id}`);
        await this.redisService.del(`player-${playerId}`);
      });
    });
  }

  onModuleDestroy() {
    this.server.close();
  }

  @SubscribeMessage("join-game")
  handleMessage(@MessageBody() payload: string): string {
    console.log("join-game", payload);
    this.server.emit("game-joined", {
      message: "I am new player",
    });
    return "Hello world!";
  }
}
