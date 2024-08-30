import { Controller } from "@nestjs/common";
import { GameInSystemService } from "./game-in-system.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UpdateGameInSystemDto } from "@types";

@Controller()
export class GameInSystemController {
  constructor(private readonly gameInSystemService: GameInSystemService) {}

  @MessagePattern({ method: "GET", path: "/games-in-system" })
  async getAllGamesInSystem() {
    return this.gameInSystemService.getAllGamesInSystem();
  }

  @MessagePattern({ method: "PUT", path: "/games-in-system/:id" })
  async updateGameInSystem(@Payload() data: { id: string; gameInSystemData: UpdateGameInSystemDto }) {
    return this.gameInSystemService.updateGameInSystem(data.id, data.gameInSystemData);
  }
}
