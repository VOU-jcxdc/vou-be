import { Controller } from "@nestjs/common";
import { RoomGameService } from "./room-game.service";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { RoomGameStatus } from "@types";

@Controller()
export class RoomGameController {
  constructor(private readonly roomGameService: RoomGameService) {}

  @MessagePattern({ method: "POST", path: "/quiz-game/room-game" })
  async createRoomGame(@Payload() data: { eventId: string }) {
    return this.roomGameService.createRoomGame(data.eventId);
  }

  @MessagePattern({ method: "POST", path: "/quiz-game/room-game/:roomId/available" })
  async checkAvailableRoomGame(@Payload() { roomId }: { roomId: string }) {
    return this.roomGameService.checkAvailableRoomGame(roomId);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/room-game" })
  async getRoomGame(@Payload() { eventId }: { eventId: string }) {
    return this.roomGameService.getRoomGame(eventId);
  }

  @MessagePattern({ method: "PUT", path: "/quiz-game/room-game/:roomId" })
  @EventPattern({ method: "PUT", path: "/quiz-game/room-game/:roomId" })
  async updateRoomGame(
    @Payload()
    { roomId, status, players, action }: { roomId: string; status: RoomGameStatus; players: string[]; action: string }
  ) {
    return this.roomGameService.updateRoomGame(roomId, { status, players, action });
  }

  @EventPattern({ method: "PUT", path: "/quiz-game/room-game/:roomId/players-score" })
  async updatePlayersRecord(
    @Payload() { roomId, playerId, score }: { roomId: string; playerId: string; score: number }
  ) {
    return this.roomGameService.upsertPlayerScore(roomId, playerId, score);
  }

  @MessagePattern({ method: "GET", path: "/quiz-game/room-game/:roomId/players/ranking" })
  async getPlayersRanking(@Payload() { roomId }: { roomId: string }) {
    return this.roomGameService.rankingPlayers(roomId);
  }
}
