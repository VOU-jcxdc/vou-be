import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateRecipeDto, UpdateRecipeDto } from "@types";
import { RecipeService } from "./recipe.service";

@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @MessagePattern({ method: "POST", path: "/craftable-validation" })
  isCraftable(@Payload() data: { itemId: string; quantity: number }) {
    return this.recipeService.isCraftable(data.itemId, data.quantity);
  }

  @MessagePattern({ method: "POST", path: "/recipes" })
  createRecipe(@Payload() dto: CreateRecipeDto) {
    return this.recipeService.createRecipe(dto);
  }

  @MessagePattern({ method: "PUT", path: "/recipes" })
  updateRecipe(@Payload() dto: UpdateRecipeDto & { id: string }) {
    return this.recipeService.updateRecipe(dto);
  }

  @MessagePattern({ method: "GET", path: "/recipes/:id" })
  getRecipe(@Payload() { id }: { id: string }) {
    return this.recipeService.getRecipe(id);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/recipes" })
  getRecipesInEvent(@Payload() { eventId }: { eventId: string }) {
    return this.recipeService.getRecipesInEvent(eventId);
  }

  @MessagePattern({ method: "DELETE", path: "/recipes/:id" })
  deleteRecipe(@Payload() { id }: { id: string }) {
    return this.recipeService.deleteRecipe(id);
  }
}
