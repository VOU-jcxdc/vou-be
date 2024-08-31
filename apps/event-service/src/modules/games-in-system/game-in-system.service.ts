import { Injectable } from "@nestjs/common";
import { GameInSystemRepository } from "../repository/game-in-system.repository";
import { UpdateGameInSystemDto } from "@types";

@Injectable()
export class GameInSystemService {
  constructor(private readonly gameInSystemRepository: GameInSystemRepository) {}

  async getAllGamesInSystem() {
    return this.gameInSystemRepository.findAll();
  }

  async updateGameInSystem(id: string, gameInSystemData: UpdateGameInSystemDto) {
    return this.gameInSystemRepository.updateOne({ where: { id } }, gameInSystemData);
  }
}
