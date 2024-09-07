import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CombineItemService } from "./combine_item.service";
import { AccountRoleEnum, CreateCombineItemDto, ICurrentUser } from "@types";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { Roles } from "../../decorators/roles.decorator";
import { CurrentUser } from "../../decorators";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items/combine-items")
export class CombineItemController {
  constructor(private readonly combineItemService: CombineItemService) {}

  @Roles(AccountRoleEnum.PLAYER)
  @Post()
  combineItems(@CurrentUser() user: ICurrentUser, @Body() dto: CreateCombineItemDto) {
    return this.combineItemService.combineItems(user, dto);
  }
}
