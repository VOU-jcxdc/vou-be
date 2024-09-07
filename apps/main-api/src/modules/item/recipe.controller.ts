import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RoleGuard } from "../../guard";
import { RecipeService } from "./recipe.service";
import { AccountRoleEnum, CreateRecipeDto, UpdateRecipeDto } from "@types";
import { Roles } from "../../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller("items/recipes")
export class RecipeController {
  constructor(private readonly combineItemService: RecipeService) {}

  @Roles(AccountRoleEnum.BRAND)
  @Post()
  createRecipe(@Body() dto: CreateRecipeDto) {
    return this.combineItemService.createRecipe(dto);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Put(":id")
  updateRecipe(@Param("id") id: string, @Body() dto: UpdateRecipeDto) {
    return this.combineItemService.updateRecipe(id, dto);
  }

  @Roles(AccountRoleEnum.BRAND, AccountRoleEnum.PLAYER)
  @Get(":id")
  getRecipe(@Param("id") id: string) {
    return this.combineItemService.getRecipe(id);
  }

  @Roles(AccountRoleEnum.BRAND)
  @Delete(":id")
  deleteRecipe(@Param("id") id: string) {
    return this.combineItemService.deleteRecipe(id);
  }
}
