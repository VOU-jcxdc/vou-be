import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { AccountRoleEnum, ICurrentUser, CreateItemDto } from "@types";
import { CurrentUser } from "../../decorators";
import { ItemService } from "./item.service";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @Roles(AccountRoleEnum.PLAYER)
  async getPlayerItems(@CurrentUser() user: ICurrentUser) {
    return this.itemService.getPlayerItems(user.userId);
  }

  @Get(":id/recipes")
  @Roles(AccountRoleEnum.PLAYER)
  getCraftableRecipesForItem(@Param("id") id: string) {
    return this.itemService.getCraftableRecipesForItem(id);
  }
}
