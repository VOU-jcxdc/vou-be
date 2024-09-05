import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { GameConfigService } from "./config.service";
import { AccountRoleEnum, AddConfigsDto, ICurrentUser, ValidateConfigsDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { CurrentUser } from "../../decorators";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("events")
export class GameConfigController {
  constructor(private readonly gameConfigService: GameConfigService) {}

  @Get(":id/configs")
  @Roles(AccountRoleEnum.PLAYER)
  async getConfigsInEvent(@Param("id") id: string, @CurrentUser() user: ICurrentUser) {
    return this.gameConfigService.getConfigsInEvent(id, user);
  }

  @Post("configs")
  @Roles(AccountRoleEnum.PLAYER)
  async addConfigsInEvent(@Body() data: AddConfigsDto, @CurrentUser() user: ICurrentUser) {
    return this.gameConfigService.addConfigsInEvent(data, user);
  }

  @Post("configs/validation")
  @Roles(AccountRoleEnum.PLAYER)
  async validateConfigsInEvent(@Body() data: ValidateConfigsDto, @CurrentUser() user: ICurrentUser) {
    return this.gameConfigService.validateConfigsInEvent(data, user);
  }
}
