import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { ItemService } from "./item.service";
import { Roles } from "../../decorators/roles.decorator";
import { AccountRoleEnum } from "@types";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get(":id/recipes")
  @Roles(AccountRoleEnum.PLAYER)
  getCraftableRecipesForItem(@Param("id") id: string) {
    return this.itemService.getCraftableRecipesForItem(id);
  }
}
