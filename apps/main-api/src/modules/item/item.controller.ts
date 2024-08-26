import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { ItemService } from "./item.service";
import { AccountRoleEnum, CreateRecipeDto, GetAvaibleRecipesForItemsDto, UpdateRecipeDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Roles(AccountRoleEnum.BRAND)
  @Post("recipes")
  createRecipe(@Body() dto: CreateRecipeDto) {
    return this.itemService.createRecipe(dto);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Put("recipes/:id")
  updateRecipe(@Param("id") id: string, @Body() dto: UpdateRecipeDto) {
    return this.itemService.updateRecipe(id, dto);
  }

  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  @Get("recipes/:id")
  getRecipe(@Param("id") id: string) {
    return this.itemService.getRecipe(id);
  }

  @Roles(AccountRoleEnum.PLAYER)
  @Post("recipes/available-for-items")
  getAvaibleRecipesForItems(@Body() dto: GetAvaibleRecipesForItemsDto) {
    return this.itemService.getAvaibleRecipesForItems(dto);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Delete("recipes/:id")
  deleteRecipe(@Param("id") id: string) {
    return this.itemService.deleteRecipe(id);
  }
}
