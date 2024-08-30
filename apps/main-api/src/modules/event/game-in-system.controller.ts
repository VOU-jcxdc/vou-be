import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { GameInSystemService } from "./game-in-system.service";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { Roles } from "../../decorators/roles.decorator";
import { AccountRoleEnum, UpdateGameInSystemDto } from "@types";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("games-in-system")
export class GameInSystemController {
  constructor(private readonly gameInSystemService: GameInSystemService) {}

  @Roles(AccountRoleEnum.ADMIN, AccountRoleEnum.BRAND)
  @Get()
  async getAllGamesInSystem() {
    return this.gameInSystemService.getAllGamesInSystem();
  }

  @Roles(AccountRoleEnum.ADMIN)
  @Put(":id")
  async updateGameInSystem(@Param("id") id: string, @Body() gameInSystemData: UpdateGameInSystemDto) {
    return this.gameInSystemService.updateGameInSystem(id, gameInSystemData);
  }
}
