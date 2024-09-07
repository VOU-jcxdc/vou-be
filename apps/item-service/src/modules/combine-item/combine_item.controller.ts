import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateRecipeDto, UpdateRecipeDto } from "@types";
import { CombineItemService } from "./combine_item.service";

@Controller()
export class CombineItemController {
  constructor(private readonly itemService: CombineItemService) {}

  @MessagePattern({ method: "POST", path: "/craftable-validation" })
  isCraftable(@Payload() data: { itemId: string; quantity: number }) {
    return this.itemService.isCraftable(data.itemId, data.quantity);
  }

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

  @MessagePattern({ method: "DELETE", path: "/recipes/:id" })
  deleteRecipe(@Payload() { id }: { id: string }) {
    return this.itemService.deleteRecipe(id);
  }
}
