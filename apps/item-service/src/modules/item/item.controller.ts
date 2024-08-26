import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateRecipeDto, GetAvaibleRecipesForItemsDto, ICurrentUser, UpdateRecipeDto } from "@types";
import { ItemService } from "./item.service";

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @MessagePattern({ method: "POST", path: "/recipes" })
  createRecipe(@Payload() dto: CreateRecipeDto) {
    return this.itemService.createRecipe(dto);
  }

  @MessagePattern({ method: "PUT", path: "/recipes" })
  updateRecipe(@Payload() dto: UpdateRecipeDto & { id: string }) {
    return this.itemService.updateRecipe(dto);
  }

  @MessagePattern({ method: "GET", path: "/recipes/:id" })
  getRecipe(@Payload() { id }: { id: string }) {
    return this.itemService.getRecipe(id);
  }

  @MessagePattern({ method: "GET", path: "/events/:eventId/recipes" })
  getRecipesInEvent(@Payload() { eventId }: { eventId: string }) {
    return this.itemService.getRecipesInEvent(eventId);
  }

  @MessagePattern({ method: "POST", path: "/recipes/available-for-items" })
  getAvaibleRecipesForItems(@Payload() dto: GetAvaibleRecipesForItemsDto) {
    return this.itemService.getAvaibleRecipesForItems(dto);
  }

  @MessagePattern({ method: "DELETE", path: "/recipes/:id" })
  deleteRecipe(@Payload() { id }: { id: string }) {
    return this.itemService.deleteRecipe(id);
  }
}
