import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { CombineItemService } from "./combine_item.service";
import { AccountRoleEnum, CreateRecipeDto, GetAvaibleRecipesForItemsDto, UpdateRecipeDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items")
export class CombineItemController {
  constructor(private readonly combineItemService: CombineItemService) {}

  @Roles(AccountRoleEnum.BRAND)
  @Post("recipes")
  createRecipe(@Body() dto: CreateRecipeDto) {
    return this.combineItemService.createRecipe(dto);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Put("recipes/:id")
  updateRecipe(@Param("id") id: string, @Body() dto: UpdateRecipeDto) {
    return this.combineItemService.updateRecipe(id, dto);
  }

  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  @Get("recipes/:id")
  getRecipe(@Param("id") id: string) {
    return this.combineItemService.getRecipe(id);
  }

  @Roles(AccountRoleEnum.PLAYER)
  @Post("recipes/available-for-items")
  getAvaibleRecipesForItems(@Body() dto: GetAvaibleRecipesForItemsDto) {
    return this.combineItemService.getAvaibleRecipesForItems(dto);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Delete("recipes/:id")
  deleteRecipe(@Param("id") id: string) {
    return this.combineItemService.deleteRecipe(id);
  }
}
